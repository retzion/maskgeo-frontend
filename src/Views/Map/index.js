// libraries
import React, { useEffect, useState } from "react"
import { GoogleMap, useLoadScript } from "@react-google-maps/api"
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete"
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox"

// components
import ProfileSideBar from "./ProfileSideBar"
import SelectedPlaceSideBar from "./SelectedPlaceSideBar"
import Marker from "./Marker"
import InfoWindow from "./InfoWindow"
const { decryptToken, processToken, removeToken } = require("../../util/MaskGeoApi")

// design resources
require("@reach/combobox/styles.css")
require("./index.css")
// import mapStyles from "./mapStyles"

// Set default location to Salt Lake City, Utah
let pos = { lat: 40.758701, lng: -111.876183 }

const libraries = ["places"]
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
}
const options = {
  center: pos,
  // styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
  zoom: 12,
}
let placesService, mapRef

export default function Map(props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  })
  const [markers, setMarkers] = useState([])
  const [selected, setSelected] = useState(null)
  const [details, setDetails] = useState(null)
  const [user, setUser] = useState(null)
  const [showProfile, setShowProfile] = useState(null)

  useEffect(() => {
    // check for user data
    ;(async () => {
      const { token } = props.match.params
      if (token) {
        // check for a token
        const tokenValid = await ProcessToken(token)

        if (!tokenValid) {
          setUser(null)
          alert("Your magic login link has expired.")
        } else {
          setUser(tokenValid)
        }

        if (window.history.pushState) {
          const newurl = `${window.location.protocol}//${window.location.host}`
          window.history.pushState({ path: newurl }, "", newurl)
        }
      } else {
        // fetch user data via JWT and get rid of localstorage method
        const tokenResponse = await decryptToken()
        if (tokenResponse) setUser(tokenResponse.data)
      }
    })()
  }, [])

  mapRef = React.useRef()
  const onMapLoad = React.useCallback(map => {
    mapRef.current = map

    const bounds = new window.google.maps.LatLngBounds()
    const request = {
      bounds: bounds,
      type: ["restaurant"],
    }
    placesService = new window.google.maps.places.PlacesService(map)
    placesService.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log(results)
      }
    })
  }, [])

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng })
  }, [])

  if (loadError) return "Error"
  if (!isLoaded) return "Loading..."

  return (
    <div>
      <h1 className="logo">
        MaskGeo{" "}
        <span role="img" aria-label="tent">
          😷
        </span>
      </h1>

      <Profile user={user} setShowProfile={setShowProfile} />
      <Locate panTo={panTo} />
      <Search panTo={panTo} setMarkers={setMarkers} setSelected={setSelected} />

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        options={options}
        onLoad={onMapLoad}
      >
        {markers.map(marker => {
          return (
            <Marker
              key={marker["place_id"]}
              marker={marker}
              setSelected={setSelected}
            />
          )
        })}

        {selected && (
          <InfoWindow
            place={selected}
            setSelected={setSelected}
            showDetails={() => {
              setDetails(selected)
            }}
          />
        )}

        {details && (
          <SelectedPlaceSideBar
            selected={selected}
            close={() => {
              setDetails(null)
            }}
            user={user}
            openProfile={() => {
              setShowProfile(true)
            }}
          />
        )}

        {showProfile && (
          <ProfileSideBar
            user={user}
            logOut={() => {
              removeToken()
              setUser(null)
            }}
            close={() => {
              setShowProfile(null)
            }}
          />
        )}
      </GoogleMap>
    </div>
  )
}

function Profile({ setShowProfile, user }) {
  return (
    <button
      className="profile"
      title="See account details"
      onClick={() => {
        setShowProfile(true)
      }}
    >
      {user && user.username} 👤
    </button>
  )
}

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      title="Pan to your current location"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          position => {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            panTo(pos)
          },
          () => null
        )
      }}
      style={{ fontSize: "2.1rem", cursor: "pointer" }}
    >
      🧭
    </button>
  )
}

function Search({ panTo, setMarkers, setSelected }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => pos.lat, lng: () => pos.lng },
      radius: 30 * 1000,
    },
  })
  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = e => {
    setValue(e.target.value)
  }

  const handleSelect = async address => {
    setValue(address, false)
    clearSuggestions()

    try {
      const results = await getGeocode({ address })
      let result = results[0]
      result.name = address
      const { lat, lng } = await getLatLng(result)

      // fetch Places data
      placesService.getDetails(
        {
          placeId: result.place_id,
          // fields: ["formatted_phone_number", "name", "photos", "rating" ],
        },
        (placeResults, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            result = {
              ...result,
              ...placeResults,
            }
            setMarkers([result])
            setSelected(result)
            panTo({ lat, lng })
          }
        }
      )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="🔍 search"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  )
}

async function ProcessToken(token) {
  /** Send token to backend to retrieve JWT */
  const response = await processToken(token)
  const valid = response && response.status === 200 && response.data

  if (!valid) return
  else return response.data
}

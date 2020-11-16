import React from "react"
import usePlacesAutocomplete from "use-places-autocomplete"
import { getGeocode, getLatLng } from "use-places-autocomplete"
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox"

export default ({ panTo, placesService, pos, setMarkers, setSelected }) => {
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

  const handleSelect = async (address) => {
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
          /** @TODO reduce fetched data fields */
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
    <div className="search-container">
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
    </div>
  )
}

import React from "react"
import usePlacesAutocomplete from "use-places-autocomplete"
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox"

import loadSelectedMarker from "../loadSelectedMarker"

export default ({ panTo, placesService, pos, setMarkerId, setMarkers, setSelected }) => {
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

  return (
    <div className="search-container">
      <div className="search">
        <Combobox
          onSelect={address => {
            clearSuggestions()

            loadSelectedMarker({
              address,
              panTo,
              places: window.google.maps.places,
              placesService,
              pos,
              setMarkerId,
              setMarkers,
              setSelected,
            })
          }}
        >
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

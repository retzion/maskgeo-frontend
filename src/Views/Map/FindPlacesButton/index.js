import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import "./index.css"

export default function ({ setKeywordSearchOptions, setShowPlaceTypesButtons }) {
  return (
    <button
      className="find-places nav-button"
      title="Find Places"
      onClick={() => {
        setKeywordSearchOptions(null)
        setShowPlaceTypesButtons(true)
      }}
    >
      <FontAwesomeIcon className="icon" icon={faSearch} />
    </button>
  )
}


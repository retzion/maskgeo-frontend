import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBinoculars } from '@fortawesome/free-solid-svg-icons'

import "./index.css"

export default function ProfileButton({ setShowPlaceTypesButtons }) {
  return (
    <button
      className="find-places nav-button"
      title="Find Places"
      onClick={() => {
        setShowPlaceTypesButtons(true)
      }}
    >
      <FontAwesomeIcon className="icon" icon={faBinoculars} />
    </button>
  )
}


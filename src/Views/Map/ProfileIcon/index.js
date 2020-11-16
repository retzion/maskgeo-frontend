import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import "./index.css"

export default function ProfileIcon({ setShowProfile, user }) {
  return (
    <button
      className="profile"
      title="See account details"
      onClick={() => {
        setShowProfile(true)
      }}
    >
      <span className="button-text">{user && user.username}</span>
      <FontAwesomeIcon className="icon" icon={faUser} />
    </button>
  )
}


import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import "./index.css"

export default function ProfileButton({ setShowProfile, user }) {
  return (
    <button
      className={user ? "profile authenticated" : "profile"}
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


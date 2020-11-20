import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserCog } from '@fortawesome/free-solid-svg-icons'

import "./index.css"

export default function ProfileButton({ setShowProfile, user }) {
  return (
    <button
      className={`profile nav-button ${user ? "authenticated" : ""}`}
      title="See account details"
      onClick={() => {
        setShowProfile(true)
      }}
    >
      <span className="button-text">{user && user.username}</span>
      {user && <FontAwesomeIcon className="icon" icon={faUserCog} />}
      {!user && <FontAwesomeIcon className="icon" icon={faUser} />}
    </button>
  )
}


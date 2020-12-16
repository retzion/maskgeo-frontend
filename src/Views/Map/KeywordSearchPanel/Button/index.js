import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import uniqolor from "uniqolor"

import "./index.css"

export default ({ click, keyword, icon }) => {
  return (
    <button
      onClick={() => {
        click(keyword)
      }}
    >
      <FontAwesomeIcon
        className="icon"
        icon={icon}
        style={{
          background: uniqolor(keyword.toLowerCase(), {
            lightness: 36,
          })["color"],
        }}
      />
      <span>{keyword}</span>
    </button>
  )
}

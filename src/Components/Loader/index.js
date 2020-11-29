import React from "react"
import { Dimmer, Loader } from "semantic-ui-react"

export default ({ show, text }) => {
  if (show !== false)
    return (
      <Dimmer active inverted style={{ height: document.body.clientHeight }}>
        <Loader inverted>{text || "Loading"}</Loader>
      </Dimmer>
    )
  else return null
}

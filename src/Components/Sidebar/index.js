import React, { useState } from "react"
import { Dimmer } from "semantic-ui-react"

import "./index.css"

export default ({
  close,
  sidebarControls,
  sidebarContent,
  sidebarId,
  startOpen,
  triggerControl,
  zIndex = 1,
}) => {
  const [open, setOpen] = useState(startOpen)

  if (!open) return <span onClick={setOpen}>{triggerControl}</span>
  else
    return (
      <div id={sidebarId} className="custom-sidebar">
        <Dimmer
          active
          onClickOutside={close}
          page
          style={{ zIndex: zIndex - 1, backgroundColor: "rgba(255, 255, 255, 0.66)" }}
        />
        <div className="sidebar-content" style={{ zIndex }}>
          {sidebarContent}
        </div>
        <div className="sidebar-controls" style={{ zIndex: zIndex + 1 }}>
          {sidebarControls}
        </div>
      </div>
    )
}

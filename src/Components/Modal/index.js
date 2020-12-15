import React from "react"
import { Modal } from "semantic-ui-react"

import "./index.css"

export default function (props) {
  const {
    startOpen = false,
    OpenerComponent,
    ModalContent,
    ModalControls,
    ModalHeader,
  } = props

  const modalProps = {...props}
  delete modalProps["alignControls"]
  delete modalProps["startOpen"]
  delete modalProps["OpenerComponent"]
  delete modalProps["ModalContent"]
  delete modalProps["ModalControls"]
  delete modalProps["ModalHeader"]

  const [open, setOpen] = React.useState(startOpen)

  React.useEffect(() => {
    document.body.addEventListener("click", e => {
      if (e.target.ariaLabel && e.target.ariaLabel.toLowerCase() === "close")
        setOpen(null)
    })
  }, [])

  return (
    <div className="mg-modal">
      <div
        onClick={() => {
          setOpen(true)
        }}
      >
        {OpenerComponent}
      </div>

      <Modal
        {...modalProps}
        dimmer={props.dimmer || "blurring"}
        open={open}
        onClose={() => {
          setOpen(null)
        }}
        className={props.className}
      >
        {ModalHeader && <div className="modal-header">{ModalHeader}</div>}
        {/* {ModalHeader && <Modal.Header>{ModalHeader}</Modal.Header>} */}
        <Modal.Content>{ModalContent}</Modal.Content>
        {ModalControls && (
          <Modal.Actions style={{ textAlign: props.alignControls || "right" }}>
            {ModalControls}
          </Modal.Actions>
        )}
      </Modal>
    </div>
  )
}

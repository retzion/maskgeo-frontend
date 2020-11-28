import React from "react"
import { Modal } from "semantic-ui-react"

export default function (props) {
  let {
    startOpen = false,
    OpenerComponent,
    ModalContent,
    ModalControls,
    ModalHeader,
  } = props

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
        {...props}
        dimmer={props.dimmer || "blurring"}
        open={open}
        onClose={() => {
          setOpen(null)
        }}
        style={{
          zIndex: 99,
        }}
      >
        <Modal.Header>{ModalHeader}</Modal.Header>
        <Modal.Content>{ModalContent}</Modal.Content>
        <Modal.Actions>{ModalControls}</Modal.Actions>
      </Modal>
    </div>
  )
}
import React, { useState } from "react"
import { Slider } from "react-semantic-ui-range"
import { Grid } from "semantic-ui-react"

// styles
import "./index.css"

export default props => {
  const [value, setValue] = useState(2.5)

  const settings = {
    start: 2.5,
    min: 0,
    max: 5,
    step: 0.5,
    onChange: value => {
      setValue(value)
    },
  }

  const handleValueChange = e => {
    let value = parseFloat(e.target.value)
    if (!value) value = 0
    if (value > settings.max) value = settings.max

    setValue(value)
  }

  return (
    <Grid>
      <Grid.Column width={16}>
        <p>
          <i>
            Use the slider below to rate the amount of masks you see at this location. 0 would mean no one is wearing masks. 5 would mean everyone is
            wearing masks.
          </i>
        </p>
      </Grid.Column>
      <Grid.Column width={16}>
        <Slider value={value} color="blue" settings={settings} />
      </Grid.Column>
      <Grid.Column width={16}>
        <h3>
          Your rating (0 - 5):
          <span className="my-rating">{value}</span>
        </h3>
      </Grid.Column>
    </Grid>
  )
}

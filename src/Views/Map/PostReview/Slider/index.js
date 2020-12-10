import React, { useState } from "react"
import { Slider } from "react-semantic-ui-range"
import { Grid } from "semantic-ui-react"

//components
import MaskRatingIcons from "../../../../Components/MaskRatingIcons"

// styles
import "./index.css"
import smallRatingIconCount from "../../../../Components/MaskRatingIcons/styles/smallRatingIconCount"
const ratingStyles = smallRatingIconCount({ height: 45, width: 225 })

export default ({rating, setRating, userIdMatch}) => {
  const sliderSettings = {
    start: rating,
    min: 0,
    max: 5,
    step: 0.5,
    onChange: setRating,
  }

  return (
    <Grid>
      <Grid.Column width={16}>
        <p style={{ fontSize: "0.9rem" }}>
          <i>
            Use the slider below to rate the amount of masks you see at this
            location. 0 would mean no one is wearing masks. 5 would mean
            everyone is wearing masks.
          </i>
        </p>
        <div style={{ textAlign: "center" }}>
          <MaskRatingIcons
            maskRating={rating}
            maskRatingsCount={1}
            styles={ratingStyles}
            widthMultiplier={45}
          />
          <Slider
            value={rating}
            color="blue"
            settings={sliderSettings}
            style={{ marginTop: 12 }}
          />
          <div className="my-rating">{rating}</div>
        </div>
      </Grid.Column>
    </Grid>
  )
}

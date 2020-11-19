import React, { useState } from "react"
import { Slider } from "react-semantic-ui-range"
import { Grid } from "semantic-ui-react"

//components
import MaskRatingIcons from "../../../../Components/MaskRatingIcons"

// styles
import "./index.css"
import smallRatingIconCount from "../../../../Components/MaskRatingIcons/styles/smallRatingIconCount"
const ratingStyles = smallRatingIconCount({ height: 50, width: 250 })

export default React.forwardRef((props, ref) => {
  const [rating, setRating] = useState(2.5)

  const sliderSettings = {
    start: 2.5,
    min: 0,
    max: 5,
    step: 0.5,
    onChange: setRating,
  }

  return (
    <Grid>
      <Grid.Column width={16}>
        <p>
          <i>
            Use the slider below to rate the amount of masks you see at this
            location. 0 would mean no one is wearing masks. 5 would mean
            everyone is wearing masks.
          </i>
        </p>
      </Grid.Column>
      <Grid.Column width={16}>
        <Slider
          ref={ref}
          value={rating}
          color="blue"
          settings={sliderSettings}
        />
      </Grid.Column>
      <Grid.Column width={16}>
        <div style={{ textAlign: "center", paddingTop: 15 }}>
          <MaskRatingIcons
            maskRating={rating}
            maskRatingsCount={1}
            styles={ratingStyles}
            widthMultiplier={50}
          />
          <div className="my-rating">{rating}</div>
        </div>
      </Grid.Column>
    </Grid>
  )
})

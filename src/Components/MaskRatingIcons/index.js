const React = require("react")

export default ({ maskRating, styles, widthMultiplier = 30 }) => {
  return (
    <div style={styles.ratingContainer}>
      <div
        style={{
          ...styles.ratingResults,
          width: maskRating * widthMultiplier,
        }}
      ></div>
    </div>
  )
}

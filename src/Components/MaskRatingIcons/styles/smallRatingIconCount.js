export default ({ height = 21, width = 105 }) => ({
  ratingContainer: {
    width,
    height,
    verticalAlign: "middle",
    display: "inline-block",
    margin: 0,
    backgroundImage: "url(/img/mask-grey.png)",
    backgroundSize: "contain",
    backgroundRepeat: "repeat-x",
    textAlign: "left",
  },
  ratingResults: {
    height,
    margin: 0,
    backgroundImage: "url(/img/mask.png)",
    backgroundSize: "auto 100%",
    backgroundRepeat: "repeat-x",
  },
})

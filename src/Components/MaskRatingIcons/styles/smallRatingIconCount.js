export default ({ height = 21, width = 105 }) => ({
  ratingContainer: {
    width,
    height,
    verticalAlign: "middle",
    display: "inline-block",
    margin: 0,
    backgroundImage: "url(/img/mask-grey.svg)",
    backgroundPosition: "contain",
    backgroundRepeat: "repeat-x",
    textAlign: "left",
  },
  ratingResults: {
    height,
    margin: 0,
    backgroundImage: "url(/img/mask.svg)",
    backgroundSize: "auto 100%",
    backgroundRepeat: "repeat-x",
  },
})

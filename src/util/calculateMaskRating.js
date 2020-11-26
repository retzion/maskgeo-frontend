export default result => {
  const reducer = (accumulator, { rating }) => {
    return accumulator + rating
  }
  const accumulatedRatings = result.maskReviews.reduce(reducer, 0)
  result.maskRating = result.maskReviews.length
    ? accumulatedRatings / result.maskReviews.length
    : 0
  result.maskRatingsCount = result.maskReviews.length
  result.maskReviewsCount = result.maskReviews.filter(
    r => r.review && r.review.length
  ).length
  return result
}

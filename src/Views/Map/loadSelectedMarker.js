import { getGeocode, getLatLng } from "use-places-autocomplete"

import { fetchReviews } from "../../util/MaskGeoApi"

export default async ({
  address,
  openSelected,
  panTo,
  placeId,
  places,
  placesService,
  setMarkerId,
  setMarkers,
  setSelected,
}) => {
  try {
    let geoCoordinates, result

    if (address) {
      // fetch placeId from address
      const results = await getGeocode({ address })
      result = results[0]
      const { lat, lng } = await getLatLng(result)
      geoCoordinates = { lat, lng }
      placeId = result.place_id
      if (setMarkerId) setMarkerId(placeId)
    }

    // fetch Places data
    placesService.getDetails(
      {
        placeId,
        /** @TODO reduce fetched data fields */
        // fields: ["formatted_phone_number", "name", "photos", "rating" ],
      },
      async (placeResults, status) => {
        if (status === places.PlacesServiceStatus.OK) {
          result = {
            ...result,
            ...placeResults,
          }

          geoCoordinates = geoCoordinates || {
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng(),
          }
      
          // mask reviews
          const { data: maskReviews } = await fetchReviews({
            geoCoordinates,
            googlePlaceId: placeId,
          })
          result.maskReviews = maskReviews.filter(r => r.review.length)

          // mask ratings
          const reducer = (accumulator, { rating }) => accumulator + rating
          const accumulatedRatings = maskReviews.reduce(reducer, 0)
          result.maskRating = maskReviews.length
            ? accumulatedRatings / maskReviews.length
            : 0
          result.maskRatingsCount = maskReviews.length

          setMarkers([result])
          setSelected(result)
          panTo(geoCoordinates)
          if (openSelected) openSelected(result)
        }
      }
    )
  } catch (error) {
    console.error(error)
  }
}

import { getGeocode, getLatLng } from "use-places-autocomplete"

import { fetchReviews } from "../../util/MaskGeoApi"
import calculateMaskRating from "../../util/calculateMaskRating"

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
  showPlaceDetails,
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
          panTo(geoCoordinates)
      
          // mask reviews
          let { data: maskReviews } = await fetchReviews({
            geoCoordinates,
            googlePlaceId: placeId,
          })
          if (!maskReviews) return alert("Problem fetching results.")

          result.maskReviews = maskReviews
          result.maskReviewsCount = maskReviews.filter(r => r.review && r.review.length).length

          result = calculateMaskRating(result)          

          result.customIcon = true
          if (setMarkers) setMarkers([result])
          if (openSelected && showPlaceDetails) openSelected(result)
          else setSelected(result)
        }
      }
    )
  } catch (error) {
    console.error(error)
  }
}

import { getGeocode, getLatLng } from "use-places-autocomplete"

import { fetchReviews } from "../../util/MaskGeoApi"
import calculateMaskRating from "../../util/calculateMaskRating"

export default ({
  address,
  openSelected,
  panTo,
  placeId,
  places,
  placesService,
  reference,
  setMarkerId,
  setMarkers,
  setSelected,
  setShowLoader,
  showPlaceDetails,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (setShowLoader) setShowLoader(true)

      let geoCoordinates, result

      if (address) {
        // fetch placeId from address
        const results = await getGeocode({ address })
        result = results[0]
        const { lat, lng } = await getLatLng(result)
        geoCoordinates = { lat, lng }
        placeId = result.place_id
      }

      if (setMarkerId) setMarkerId(placeId, showPlaceDetails)

      // fetch Places data
      placesService.getDetails(
        {
          placeId: reference || placeId,
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
            const fetchedReviews = await fetchReviews({
              geoCoordinates,
              googlePlaceId: placeId,
            })
            const { data: maskReviews } = fetchedReviews || { data: null }
            if (!maskReviews) return alert("Problem fetching results.")

            result.maskReviews = maskReviews
            result.maskReviewsCount = maskReviews.filter(r => r.review && r.review.length).length

            result = calculateMaskRating(result)          

            result.customIcon = true
            if (setMarkers) setMarkers([result])
            if (openSelected && showPlaceDetails) openSelected(result)
            else setSelected(result)
            if (setShowLoader) setShowLoader(false)
            resolve(result)
          }
          else reject()
        }
      )
    } catch (error) {
      console.error(error)
      reject()
    }
  })
}

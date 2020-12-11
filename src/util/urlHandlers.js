export default {
    setMarkerId: markerId => {
      if (window.history.pushState) {
        const indexOfSelected = window.location.pathname.indexOf("/location/")
        let newurl =
          indexOfSelected > -1
            ? window.location.pathname.substring(0, indexOfSelected)
            : window.location.pathname
        if (markerId) newurl += `/location/${markerId}`
        newurl = cleanExtraSlashes(newurl)
        window.history.pushState(
          {},
          "",
          newurl + window.location.hash
        )
      }
    },
    setKeywordSearchUrl: params => {
      const { keyword, location, selectedId, showPlaceDetails, zoom = 12 } = params
      if (keyword && location) {
        // load markerss for a nearby search
        if (window.history.pushState) {
          let newurl = `/search/${encodeURIComponent(keyword)}/@${location.lat},${location.lng},${zoom}`
          if (selectedId) newurl += `/location/${selectedId}`
          if (showPlaceDetails) newurl += `?details=1`
          window.history.pushState({}, "", newurl)
        }
      }
    },
    setPlacesSearchBoxUrl: params => {
      const { keyword, location, selectedId, showPlaceDetails, zoom = 12 } = params
      if (keyword && location) {
        // load markerss for a nearby search
        if (window.history.pushState) {
          let newurl = `/find/${encodeURIComponent(keyword)}/@${location.lat},${location.lng},${zoom}`
          if (selectedId) newurl += `/location/${selectedId}`
          if (showPlaceDetails) newurl += `?details=1`
          window.history.pushState({}, "", newurl)
        }
      }
    },
    setSelectedId: (selectedId, details) => {
      // load place details for a marker
      if (window.history.pushState) {
        let newurl = !selectedId
          ? window.location.pathname
          : window.location.pathname.replace(`/location/${selectedId}`, "")
        if (selectedId) newurl += `/location/${selectedId}`
        if (details) newurl += `?details`
        newurl = cleanExtraSlashes(newurl)
        window.history.pushState(
          {},
          "",
          newurl + window.location.hash
        )
      }
    },
    setProfileQueryParam: show => {
      // set URL
      if (window.history.pushState) {
        const href = window.location.href.replace("?profile", "")
        const newurl = show ? `${href}?profile` : href
        window.history.pushState({}, "", newurl)
      }
    },
  }

function cleanExtraSlashes(url) {
  url = url.replace("//", "")
  if (!url.startsWith("/")) url = "/" + url
  return url
}
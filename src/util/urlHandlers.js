export default {
    setMarkerId: markerId => {
      if (window.history.pushState) {
        const indexOfSelected = window.location.pathname.indexOf("/selected/")
        let newurl =
          indexOfSelected > -1
            ? window.location.pathname.substring(0, indexOfSelected)
            : window.location.pathname
        if (markerId) newurl += `/selected/${markerId}`
        newurl = cleanExtraSlashes(newurl)
        newurl = `${window.location.protocol}//${window.location.host}${newurl}`
        window.history.pushState(
          { path: newurl },
          "",
          newurl + window.location.hash
        )
      }
    },
    setKeywordSearchUrl: params => {
      const { keyword, location, selected, zoom = 12 } = params
      if (keyword && location) {
        // load markerss for a nearby search
        if (window.history.pushState) {
          let newurl = `${window.location.protocol}//${window.location.host}/search/${encodeURIComponent(keyword)}/@${location.lat},${location.lng},${zoom}`
          if (selected) newurl += `/selected/${selected}`
          window.history.pushState({ path: newurl }, "", newurl)
        }
      }
    },
    setPlacesSearchBoxUrl: params => {
      const { keyword, location, selected, zoom = 12 } = params
      if (keyword && location) {
        // load markerss for a nearby search
        if (window.history.pushState) {
          let newurl = `${window.location.protocol}//${window.location.host}/find/${encodeURIComponent(keyword)}/@${location.lat},${location.lng},${zoom}`
          if (selected) newurl += `/selected/${selected}`
          window.history.pushState({ path: newurl }, "", newurl)
        }
      }
    },
    setSelectedId: (selectedId, details) => {
      // load place details for a marker
      if (window.history.pushState) {
        let newurl = !selectedId
          ? window.location.pathname
          : window.location.pathname.replace(`/selected/${selectedId}`, "")
        if (selectedId) newurl += `/selected/${selectedId}`
        if (details) newurl += `?details`
        newurl = cleanExtraSlashes(newurl)
        newurl = `${window.location.protocol}//${window.location.host}${newurl}`
        window.history.pushState(
          { path: newurl },
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
        window.history.pushState({ path: newurl }, "", newurl)
      }
    },
  }

function cleanExtraSlashes(url) {
  url = url.replace("//", "")
  if (!url.startsWith("/")) url = "/" + url
  return url
}
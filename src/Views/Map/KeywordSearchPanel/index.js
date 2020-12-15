import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBed,
  faCoffee,
  faDumbbell,
  faEnvelope,
  faGasPump,
  faGlassCheers,
  faHamburger,
  faHSquare,
  faParking,
  faPrescriptionBottleAlt,
  faShoppingCart,
  faSpa,
  faStore,
  faTimes,
  faTree,
  faTshirt,
  faUniversity,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons"
import { Input } from "semantic-ui-react"

// components
import Button from "./Button"

//styles
import "./index.css"

export default ({
  close,
  getBounds,
  keywordSearchOptions,
  mapRef,
  placesService,
  pos,
  searchBoxOptions,
  setBounds,
  setDetails,
  setShowLoader,
  setKeywordSearchUrl,
  setMarkers,
  setPlacesSearchBoxUrl,
  setSelected,
  showProfile,
}) => {console.log({pos})
  let searchBox, searchBoxInput

  React.useEffect(() => {
    initSearchbox()
    if (searchBoxOptions) searchBoxSearch(searchBoxOptions)
    if (keywordSearchOptions) nearbySearch(keywordSearchOptions)
  }, [])

  function click(placeType) {
    setSelected(null)
    // bounds = new window.google.maps.LatLngBounds()
    setBounds(mapRef.current.getBounds())
    nearbySearch({
      location: pos,
      rankBy: window.google.maps.places.RankBy.DISTANCE,
      keyword: placeType,
    })
  }

  function initSearchbox() {
    const bounds = getBounds()
    searchBoxInput = document.getElementById("find")
    searchBox = new window.google.maps.places.SearchBox(searchBoxInput, {
      bounds,
    })
    mapRef.current.addListener("bounds_changed", () => {
      searchBox.setBounds(mapRef.current.getBounds())
    })
    searchBox.addListener("places_changed", getPlaces)
  }

  function getPlaces() {
    const places = searchBox.getPlaces()
    const bounds = new window.google.maps.LatLngBounds()

    for (let i = 0; i < places.length; i++) {
      bounds.extend(places[i].geometry.location)
    }

    setBounds(bounds)
    mapRef.current.fitBounds(bounds)
    setMarkers(places)

    if (places.length > 1) setSelected(null)
    else setSelected(places[0])

    if (!showProfile)
      setPlacesSearchBoxUrl({
        keyword: searchBoxInput.value,
        location: pos,
        // selected: selectedId,
        rankBy: window.google.maps.places.RankBy.DISTANCE,
        zoom: mapRef.current.getZoom(),
      })

    close()
  }

  function nearbySearch(options, searchbox) {
    console.log(options)
    const {
      keyword,
      location,
      rankBy,
      selectedId,
      showPlaceDetails,
      zoom,
    } = options
    const bounds = getBounds() || new window.google.maps.LatLngBounds()
    setShowLoader(true)
    placesService.nearbySearch(options, (results, status) => {
      setShowLoader(false)
      if (status == window.google.maps.places.PlacesServiceStatus.OK) {
        let selected
        for (let i = 0; i < results.length; i++) {
          if (results[i]["reference"] === selectedId) {
            selected = results[i]
            results[i]["selectOnLoad"] = true
          }
          bounds.extend(results[i].geometry.location)
        }

        mapRef.current.fitBounds(bounds)
        setMarkers(results)
        if (!showProfile && !searchbox)
          setKeywordSearchUrl({
            keyword,
            location,
            selectedId,
            showPlaceDetails,
            rankBy,
            zoom: zoom || mapRef.current.getZoom(),
          })
        else if (!showProfile && searchbox)
          setPlacesSearchBoxUrl({
            keyword,
            location,
            selectedId,
            showPlaceDetails,
            rankBy,
            zoom: zoom || mapRef.current.getZoom(),
          })
        if (selected) setSelected(selected)
        if (showPlaceDetails) setDetails(selected)
        close()
      }
    })
  }

  function searchBoxSearch(options) {
    nearbySearch(
      {
        ...options,
        keyword: options.searchInput,
      },
      true
    )
  }

  return (
    <div className={`keyword-search-buttons`}>
      <div className="open-sidebar">
        <a className="nav close" onClick={close}>
          <FontAwesomeIcon icon={faTimes} />
        </a>

        <div className="keyword-search-container">
          <Input
            id="find"
            placeholder="search for places"
            className="keyword-search"
          />
        </div>

        <div className="keyword-buttons">
          <Button keyword="Groceries" icon={faShoppingCart} click={click} />
          <Button keyword="Resturants" icon={faUtensils} click={click} />
          <Button keyword="Takeout" icon={faHamburger} click={click} />
          <Button keyword="Bars" icon={faGlassCheers} click={click} />
          <Button keyword="Cafes" icon={faCoffee} click={click} />
          <Button keyword="Drug Stores" icon={faStore} click={click} />
          <Button keyword="Gyms" icon={faDumbbell} click={click} />
          <Button keyword="Laundry" icon={faTshirt} click={click} />
          <Button keyword="Parks" icon={faTree} click={click} />
          <Button keyword="Spas" icon={faSpa} click={click} />
          <Button keyword="Hotels" icon={faBed} click={click} />
          <Button keyword="Banks" icon={faUniversity} click={click} />
          <Button keyword="Gas" icon={faGasPump} click={click} />
          <Button keyword="Parking" icon={faParking} click={click} />
          <Button
            keyword="Pharmacy"
            icon={faPrescriptionBottleAlt}
            click={click}
          />
          <Button keyword="Post Office" icon={faEnvelope} click={click} />
          <Button keyword="Hospital" icon={faHSquare} click={click} />
        </div>
      </div>
    </div>
  )
}

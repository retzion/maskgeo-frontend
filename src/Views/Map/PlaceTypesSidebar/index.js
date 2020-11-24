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
  bounds,
  close,
  keywordSearchOptions,
  mapRef,
  placesService,
  pos,
  setKeywordSearchUrl,
  setMarkers,
  setSelected,
}) => {

  React.useEffect(() => {
    if (keywordSearchOptions) nearbySearch(keywordSearchOptions)
  }, [])

  function click(placeType) {
    setSelected(null)
    bounds = new window.google.maps.LatLngBounds()
    nearbySearch({
      location: pos,
      rankBy: window.google.maps.places.RankBy.DISTANCE,
      keyword: placeType,
    })
  }

  function nearbySearch(options) {
    const { keyword, location, rankBy, zoom } = options
    placesService.nearbySearch(
      options,
      (results, status) => {
        if (status == window.google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            bounds.extend(results[i].geometry.location)
          }

          mapRef.current.fitBounds(bounds)
          setMarkers(results)
          setKeywordSearchUrl({
            location,
            rankBy,
            keyword,
            zoom: zoom || mapRef.current.getZoom(),
          })
          close()
        }
      }
    )
  }

  function handleSearchTextKeyUp(event) {
    var key = event.keyCode
    if (key === 13) click(event.target.value)
  }

  return (
    <div className={`place-type-buttons`}>
      <div className="open-sidebar">
        <a className="nav close" onClick={close}>
          <FontAwesomeIcon icon={faTimes} />
        </a>

        <div className="keyword-search-container">
          <Input
            placeholder="search for keyword"
            className="keyword-search"
            onKeyUp={handleSearchTextKeyUp}
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

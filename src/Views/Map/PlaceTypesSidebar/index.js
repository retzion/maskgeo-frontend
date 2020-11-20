import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBed,
  faChevronDown,
  faChevronUp,
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
import uniqolor from "uniqolor"

//styles
import "./styles/index.css"

export default ({
  bounds,
  close,
  mapRef,
  placesService,
  pos,
  setMarkerId,
  setMarkers,
  setSelected,
}) => {
  const [showMore, setShowMore] = React.useState(null)

  function click(placeType) {
    setSelected(null)
    bounds = new window.google.maps.LatLngBounds()

    placesService.nearbySearch(
      {
        location: pos,
        rankBy: window.google.maps.places.RankBy.DISTANCE,
        keyword: placeType,
      },
      (results, status) => {
        if (status == window.google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            bounds.extend(results[i].geometry.location)
          }

          mapRef.current.fitBounds(bounds)
          setMarkers(results)
          setMarkerId(results.map(r => r.place_id))
          close()
        }
      }
    )
  }

  return (
    <div className={`place-type-buttons ${showMore ? "expanded" : ""}`}>
      <div className="open-sidebar">
        <a className="nav close" onClick={close}>
          <FontAwesomeIcon icon={faTimes} />
        </a>

        <a
          style={{ display: showMore ? "none" : "grid" }}
          className="nav more"
          onClick={() => {
            setShowMore(true)
          }}
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </a>

        <a
          style={{ display: showMore ? "grid" : "none" }}
          className="nav less"
          onClick={() => {
            setShowMore(null)
          }}
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </a>

        <button
          onClick={() => {
            click("groceries")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faShoppingCart}
            style={{
              background: uniqolor("groceries", { lightness: [45] })["color"],
            }}
          />
          <span>Groceries</span>
        </button>

        <button
          onClick={() => {
            click("resturants")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faUtensils}
            style={{
              background: uniqolor("resturants", { lightness: [45] })["color"],
            }}
          />
          <span>Resturants</span>
        </button>

        <button
          onClick={() => {
            click("takeout")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faHamburger}
            style={{
              background: uniqolor("takeout", { lightness: [45] })["color"],
            }}
          />
          <span>Takeout</span>
        </button>

        <button
          onClick={() => {
            click("bar")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faGlassCheers}
            style={{
              background: uniqolor("bar", { lightness: [45] })["color"],
            }}
          />
          <span>Bars</span>
        </button>

        <button
          onClick={() => {
            click("cafe")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faCoffee}
            style={{
              background: uniqolor("cafe", { lightness: [45] })["color"],
            }}
          />
          <span>Cafes</span>
        </button>

        <button
          onClick={() => {
            click("drug store")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faStore}
            style={{
              background: uniqolor("drug store", { lightness: [45] })["color"],
            }}
          />
          <span>Drug Stores</span>
        </button>

        <button
          onClick={() => {
            click("gym")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faDumbbell}
            style={{
              background: uniqolor("gym", { lightness: [45] })["color"],
            }}
          />
          <span>Gyms</span>
        </button>

        <button
          onClick={() => {
            click("laundry")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faTshirt}
            style={{
              background: uniqolor("laundry", { lightness: [45] })["color"],
            }}
          />
          <span>Laundry</span>
        </button>

        <button
          onClick={() => {
            click("park")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faTree}
            style={{
              background: uniqolor("park", { lightness: [45] })["color"],
            }}
          />
          <span>Parks</span>
        </button>

        <button
          onClick={() => {
            click("spa")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faSpa}
            style={{
              background: uniqolor("spa", { lightness: [45] })["color"],
            }}
          />
          <span>Spas</span>
        </button>

        <button
          onClick={() => {
            click("hotels")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faBed}
            style={{
              background: uniqolor("hotels", { lightness: [45] })["color"],
            }}
          />
          <span>Hotels</span>
        </button>

        <button
          onClick={() => {
            click("banks")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faUniversity}
            style={{
              background: uniqolor("banks", { lightness: [45] })["color"],
            }}
          />
          <span>Banks</span>
        </button>

        <button
          onClick={() => {
            click("gas station")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faGasPump}
            style={{
              background: uniqolor("gas station", { lightness: [45] })["color"],
            }}
          />
          <span>Gas</span>
        </button>

        <button
          onClick={() => {
            click("parking")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faParking}
            style={{
              background: uniqolor("parking", { lightness: [45] })["color"],
            }}
          />
          <span>Parking</span>
        </button>

        <button
          onClick={() => {
            click("pharmacy")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faPrescriptionBottleAlt}
            style={{
              background: uniqolor("pharmacy", { lightness: [45] })["color"],
            }}
          />
          <span>Pharmacy</span>
        </button>

        <button
          onClick={() => {
            click("post office")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faEnvelope}
            style={{
              background: uniqolor("post office", { lightness: [45] })["color"],
            }}
          />
          <span>Post Office</span>
        </button>

        <button
          onClick={() => {
            click("hospital")
          }}
        >
          <FontAwesomeIcon
            className="icon"
            icon={faHSquare}
            style={{
              background: uniqolor("hospital", { lightness: [45] })["color"],
            }}
          />
          <span>Hospital</span>
        </button>
      </div>
    </div>
  )
}

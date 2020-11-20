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
              background: "#188038",
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
              background: "#129EAF",
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
              background: "#C5221F",
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
              background: "rgb(219, 187, 7)",
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
              background: "rgb(17, 180, 72)",
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
              background: "rgb(51, 105, 223)",
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
              background: "rgb(151, 31, 31)",
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
              background: "rgb(233, 222, 65)",
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
              background: "rgb(36, 105, 54)",
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
      background: "#0000fa",
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
              background: "#E37400",
            }}
          />
          <span>Hotels</span>
        </button>

        <button
          onClick={() => {
            click("banks")
          }}
        >
          <FontAwesomeIcon className="icon" icon={faUniversity} />
          <span>Banks</span>
        </button>

        <button
          onClick={() => {
            click("gas station")
          }}
        >
          <FontAwesomeIcon className="icon" icon={faGasPump} />
          <span>Gas</span>
        </button>

        <button
          onClick={() => {
            click("parking")
          }}
        >
          <FontAwesomeIcon className="icon" icon={faParking} />
          <span>Parking</span>
        </button>

        <button
          onClick={() => {
            click("pharmacy")
          }}
        >
          <FontAwesomeIcon className="icon" icon={faPrescriptionBottleAlt} />
          <span>Pharmacy</span>
        </button>

        <button
          onClick={() => {
            click("post office")
          }}
        >
          <FontAwesomeIcon className="icon" icon={faEnvelope} />
          <span>Post Office</span>
        </button>

        <button
          onClick={() => {
            click("hospital")
          }}
        >
          <FontAwesomeIcon className="icon" icon={faHSquare} />
          <span>Hospital</span>
        </button>
      </div>
    </div>
  )
}

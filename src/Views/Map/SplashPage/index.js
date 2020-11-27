import React from "react"
import UniversalCookie from "universal-cookie"

// styles and images
import bitcoinLogo from "../../../assets/img/bitcoin-logo.png"
import btcQr from "../../../assets/img/bitcoin-qr.png"
import donatePayPal from "../../../assets/img/donate-paypal.gif"
import mask from "../../../assets/img/mask.png"
import payPalLogo from "../../../assets/img/paypal-logo.png"
import "./index.css"

const Cookies = new UniversalCookie()

export default ({setAllowAccess}) => (
  <div className="splash-page">
    <div>
      <h2 className="welcome">Welcome to Mask Forecast <img src={mask} alt="MaskForecast" /></h2>
      {/* <p>Your resource for knowing the mask situation of locations you plan to visit.</p> */}
      <p>
        Check the forecast for masks before you go out. Leave ratings and
        reviews on locations based on your experience with masks.
      </p>
    </div>
    <div className="disabled">
      <h3>Help Support Us</h3>
      {/* <p>We need server space and more human resources. Please help us stay alive by sending some change.</p> */}
      <p>Please help this web app thrive by sending some change.</p>
      <div className="donate">
        <div className="donate-bitcoin">
          <img
            src={bitcoinLogo}
            alt="Donate with Bitcoin"
            className="bitcoin-icon"
          />
          <img
            src={btcQr}
            alt="3FTMoRZ1RyUPWBedobFNTKH4n1iWTGchnp"
            style={{ maxWidth: 66 }}
          />
          <div>3FTMoRZ1RyUPWBedobFNTKH4n1iWTGchnp</div>
        </div>
        <div>
          <img src={payPalLogo} alt="PayPal" style={{ maxWidth: 90 }} />
          <br />
          <img
            src={donatePayPal}
            alt="Donate with PayPal"
            style={{ maxWidth: 90 }}
          />
        </div>
      </div>
    </div>
    <div>
      <h3>Cookies Notification</h3>
      <p>
        By using this site, you consent to allowing cookies to be used in your
        browser.
      </p>
    </div>
    <button
      className="primary big"
      onClick={() => {
        const expires = new Date().addDays(1)
        Cookies.set("allow-cookies", true, { expires, path: "/" })
        setAllowAccess(true)
      }}
    >
      I Agree
    </button>
    {/* <input
      type="text"
      placeholder="Enter preview passcode"
      style={{
        fontSize: "1.5rem",
        margin: "0 1%",
        width: "90%",
        textAlign: "center",
      }}
      onChange={e => {
        const value = e.target.value
        if (value === "1776") {
          const expires = new Date().addDays(1)
          Cookies.set("allow-cookies", true, { expires, path: "/" })
          setAllowAccess(true)
        }
      }}
    /> */}
  </div>
)

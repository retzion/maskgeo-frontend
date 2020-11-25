import React from "react"
import UniversalCookie from "universal-cookie"

// styles and images
import bitcoinLogo from "../../../assets/img/bitcoin-logo.png"
import btcQr from "../../../assets/img/bitcoin-qr.png"
import donatePayPal from "../../../assets/img/donate-paypal.gif"
import payPalLogo from "../../../assets/img/paypal-logo.png"
import "./index.css"

const Cookies = new UniversalCookie()

export default () => (
  <div className="splash-page">
    <div>
      <h1>Welcome to Mask Forecast</h1>
      {/* <p>Your resource for knowing the mask situation of locations you plan to visit.</p> */}
      <p>Check the forecast for masks before you go out. Leave ratings and reviews on locations based on your experience with mask wearing.</p>
    </div>
    <input
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
          Cookies.set("allow-access", true, { expires, path: "/" })
          document.location.reload()
        }
      }}
    />
    <div>
      <h2>Help Support Us</h2>
      {/* <p>We need server space and more human resources. Please help us stay alive by sending some change.</p> */}
      <p>Please help this web app thrive by sending some change.</p>
      <div className="donate">
        <div style={{ fontSize: "0.45rem" }}>
          <img
            src={bitcoinLogo}
            alt="Donate with Bitcoin"
            style={{ maxWidth: 33, position: "absolute", left: 30 }}
          />
          <img
            src={btcQr}
            alt="38JNvdDbuVweQuMawf8F3cPNyAmK8nPzT9"
            style={{ maxWidth: 66 }}
          />
          <div>38JNvdDbuVweQuMawf8F3cPNyAmK8nPzT9</div>
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
  </div>
)

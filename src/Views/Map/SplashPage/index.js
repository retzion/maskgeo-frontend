import React from "react"
import UniversalCookie from "universal-cookie"
import { Button, Input } from "semantic-ui-react"

import Modal from "../../../Components/Modal"

// helpers
import { cookieNames } from "../../../config"

// styles and images
import bitcoinLogo from "../../../assets/img/bitcoin-logo.png"
import btcQr from "../../../assets/img/bitcoin-qr.png"
import donatePayPal from "../../../assets/img/donate-paypal.gif"
import mask from "../../../assets/img/mask.png"
import payPalLogo from "../../../assets/img/paypal-logo.png"
import "./index.css"

const Cookies = new UniversalCookie()

export default ({ setAllowAccess }) => (
  <Modal
    alignControls="center"
    closeOnDimmerClick={false}
    startOpen={true}
    ModalHeader={
      <span className="splash-page-welcome">
        Welcome to Mask Forecast <img src={mask} alt="MaskForecast" />
      </span>
    }
    ModalContent={
      <div className="splash-page">
        <div>
          <p>
            Check the forecast for masks before you go out. Leave ratings and
            reviews on locations based on your experience with masks.
          </p>
        </div>
        <div className="donate disabled">
          <h3>Donate</h3>
          <div className="donate-options">
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
            By using this site, you consent to allowing cookies to be used in
            your browser.
          </p>
        </div>
        <Input
          type="text"
          placeholder="Enter preview passcode"
          style={{
            marginTop: "21px",
          }}
          onChange={e => {
            const value = e.target.value
            if (value === "1776") {
              const expires = new Date().addDays(1)
              Cookies.set(cookieNames.allowCookies, true, {
                expires,
                path: "/",
              })
              setAllowAccess(true)
            }
          }}
        />
      </div>
    }
    // ModalControls={[
    //   <Input
    //     type="text"
    //     placeholder="Enter preview passcode"
    //     style={{
    //       marginBottom: "2%",
    //     }}
    //     onChange={e => {
    //       const value = e.target.value
    //       if (value === "1776") {
    //         const expires = new Date().addDays(1)
    //         Cookies.set(cookieNames.allowCookies, true, { expires, path: "/" })
    //         setAllowAccess(true)
    //       }
    //     }}
    //   />,
    //   <Button
    //     className="primary big"
    //     onClick={() => {
    //       const expires = new Date().addDays(1)
    //       Cookies.set(cookieNames.allowCookies, true, {
    //         expires,
    //         path: "/",
    //       })
    //       setAllowAccess(true)
    //     }}
    //   >
    //     I Agree
    //   </Button>,
    // ]}
  />
)

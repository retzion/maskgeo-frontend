import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheck,
  faEnvelope,
  faLink,
  faShareAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"
import {
  faFacebookF,
  faLinkedinIn,
  faPinterest,
  faReddit,
  faTelegramPlane,
  faTumblr,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons"
import { CopyToClipboard } from "react-copy-to-clipboard"

// helpers
import { websiteSettings } from "../../../../config"

// images & styles
import logo from "../../../../assets/img/logo-w-text-horz.png"

export default function ({ close, selected = {} }) {
  const { name, reference, vicinity } = selected

  const baseUrl = `${document.location.protocol}//${document.location.host}/selected/${reference}?details`
  const [showShareOptions, setShowShareOptions] = useState(null)
  const [clipboard, setClipboard] = useState({
    value: baseUrl,
    copied: false,
  })

  const shareText = `Mask Forecast for ${name}, ${vicinity}`
  const shareUrl = encodeURIComponent(window.location)
  const shareImage = encodeURIComponent(window.location + "img/logo-w-text.png")
  const platformUrls = {
    email: `mailto:?subject=${shareText}&body=${shareText} ${shareUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?href=${shareUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?url=${shareUrl}&mini=true`,
    pinterest: `https://www.pinterest.com/pin-builder/?url=${shareUrl}&media=${shareImage}&method=button`,
    reddit: `https://www.reddit.com/submit?url=${shareUrl}&title=${shareText}`,
    telegram: `https://telegram.me/share/?url=${shareUrl}&text=${shareText}`,
    tumblr: `https://www.tumblr.com/widgets/share/tool/preview?canonicalUrl=${shareUrl}&title=${shareText}&posttype=link`,
    twitter: `https://twitter.com/share?url=${shareUrl}&text=${shareText}`,
    whatsapp: `https://api.whatsapp.com/send?text=${shareText} ${shareUrl}`,
  }

  function openShareWindow(platform) {
    const outerHeight = window.outerHeight
    const outerWidth = window.outerWidth
    const reduceWindowSize = outerWidth > 550 && outerWidth * 0.75 > 550
    const height = reduceWindowSize ? outerHeight * 0.81 : outerHeight
    const width = reduceWindowSize ? outerWidth * 0.75 : outerWidth
    const openerConfig = {
      height,
      width,
      top: reduceWindowSize ? outerHeight * 0.1012 : 0,
      left: reduceWindowSize ? outerWidth * 0.1125 : 0,
      location: "no",
      toolbar: "no",
      status: "no",
      directories: "no",
      menubar: "no",
      scrollbars: "yes",
      resizable: "no",
      centerscreen: "yes",
      chrome: "yes",
    }

    window.open(
      platformUrls[platform],
      null,
      Object.keys(openerConfig)
        .map(key => `${key}=${openerConfig[key]}`)
        .join(", ")
    )
  }

  const ShareOptions = () => (
    <div className="share-options">
      <button
        className="top-button right-button share-cancel"
        onClick={() => {
          setShowShareOptions(false)
        }}
      >
        <span>Done</span>
      </button>

      <h3 className="share-location">
        Share This Location&nbsp;&nbsp;&nbsp;
        <span className="icon-container">
          <FontAwesomeIcon className="icon" icon={faShareAlt} />
        </span>
      </h3>

      <div className="share-buttons">
        <button
          className="top-button share-button share-facebook"
          onClick={() => {
            openShareWindow("facebook")
          }}
        >
          <span>Facebook</span>
          <span className="icon-container">
            <FontAwesomeIcon className="icon" icon={faFacebookF} />
          </span>
        </button>

        <button
          className="top-button share-button share-linkedin"
          onClick={() => {
            openShareWindow("linkedin")
          }}
        >
          <span>LinkedIn</span>
          <span className="icon-container">
            <FontAwesomeIcon className="icon" icon={faLinkedinIn} />
          </span>
        </button>

        <button
          className="top-button share-button share-pinterest"
          onClick={() => {
            openShareWindow("pinterest")
          }}
        >
          <span>Pinterest</span>
          <span className="icon-container">
            <FontAwesomeIcon className="icon" icon={faPinterest} />
          </span>
        </button>

        <button
          className="top-button share-button share-reddit"
          onClick={() => {
            openShareWindow("reddit")
          }}
        >
          <span>Reddit</span>
          <span className="icon-container">
            <FontAwesomeIcon className="icon" icon={faReddit} />
          </span>
        </button>

        <button
          className="top-button share-button share-telegram"
          onClick={() => {
            openShareWindow("telegram")
          }}
        >
          <span>Telegram</span>
          <span className="icon-container">
            <FontAwesomeIcon className="icon" icon={faTelegramPlane} />
          </span>
        </button>

        <button
          className="top-button share-button share-twitter"
          onClick={() => {
            openShareWindow("twitter")
          }}
        >
          <span>Twitter</span>
          <span className="icon-container">
            <FontAwesomeIcon className="icon" icon={faTwitter} />
          </span>
        </button>

        <button
          className="top-button share-button share-tumblr"
          onClick={() => {
            openShareWindow("tumblr")
          }}
        >
          <span>Tumblr</span>
          <span className="icon-container">
            <FontAwesomeIcon className="icon" icon={faTumblr} />
          </span>
        </button>

        <button
          className="top-button share-button share-whatsapp"
          onClick={() => {
            openShareWindow("whatsapp")
          }}
        >
          <span>Whatsapp</span>
          <span className="icon-container">
            <FontAwesomeIcon className="icon" icon={faWhatsapp} />
          </span>
        </button>

        <button
          className="top-button share-button share-email"
          onClick={() => {
            openShareWindow("email")
          }}
        >
          <span>Email</span>
          <span className="icon-container">
            <FontAwesomeIcon className="icon" icon={faEnvelope} />
          </span>
        </button>

        <input
          style={{ visibility: "hidden", position: "absolute" }}
          value={clipboard.value}
          onChange={({ target: { value } }) =>
            setClipboard({ value, copied: false })
          }
        />
        <CopyToClipboard
          text={clipboard.value}
          onCopy={() => {
            setClipboard({ ...clipboard, copied: true })
            setTimeout(() => {
              setClipboard({ ...clipboard, copied: false })
            }, 2500)
          }}
        >
          <button className="top-button share-button copy-url">
            <span>{clipboard.copied ? " Copied! " : "Copy Link"}</span>
            <span className="icon-container">
              <FontAwesomeIcon
                className="icon"
                icon={clipboard.copied ? faCheck : faLink}
              />
            </span>
          </button>
        </CopyToClipboard>
      </div>
    </div>
  )

  return (
    <React.Fragment>
      {!showShareOptions && (
        <a onClick={close} className="top-button close">
          <span className="icon-container">
            <FontAwesomeIcon className="icon" icon={faTimes} />
          </span>
        </a>
      )}

      {showShareOptions && <ShareOptions />}
      {!showShareOptions && (
        <button
          className="top-button right-button share-button share"
          onClick={() => {
            setShowShareOptions(true)
          }}
        >
          <span>Share</span>
          <span className="icon-container">
            <FontAwesomeIcon className="icon" icon={faShareAlt} />
          </span>
        </button>
      )}
      {!showShareOptions && (
        <img src={logo} alt={websiteSettings.friendlyName} className="logo" />
      )}
    </React.Fragment>
  )
}

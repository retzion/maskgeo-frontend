import React, { useRef, useState } from "react"
import validate from "validator"
import UniversalCookie from "universal-cookie"
import { Form, Input } from "semantic-ui-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

// helpers
import { cookieNames } from "../../../config"
import { createUser, requestMagicLoginLink } from "../../../util/MaskGeoApi"
import Modal from "../../../Components/Modal"

// styles
import "./index.css"

const Cookies = new UniversalCookie()

export default function ProfileSideBar({ close, logOut, user }) {
  const { email: userEmail, username } = user || {}

  const [email, setEmailState] = useState(null)
  const [loginLinkSent, setLoginLinkSent] = useState(null)
  const [showLogin, setShowLogin] = useState(null)

  const emailInput = useRef()
  const newUserUsernameInput = useRef()
  const newUserEmailInput = useRef()

  React.useEffect(() => {
    const emailValue = Cookies.get(cookieNames.email)
    emailInput.current.value = emailValue
    if (email != emailValue) setEmailState(emailValue)
    if (emailValue && emailValue.length) setShowLogin(true)
  }, [])

  function setEmail(inputValue) {
    const cookieValue = Cookies.get(cookieNames.email)

    const expires = new Date().addDays(90)
    if (inputValue != cookieValue)
      Cookies.set(cookieNames.email, inputValue, { expires, path: "/" })
    if (inputValue != email) setEmailState(inputValue)
    if (inputValue && inputValue.length) setShowLogin(true)
  }

  async function logIn() {
    const valid = validate.isEmail(emailInput.current.inputRef.current.value)
    if (!valid) alert("This is not a valid email address!")
    else {
      const currentEmailValue = emailInput.current.inputRef.current.value
      const magicLinkResponse = await requestMagicLoginLink(currentEmailValue)
      setEmail(currentEmailValue)
      if (magicLinkResponse && magicLinkResponse.status === 200)
        setLoginLinkSent(true)
      else
        alert(
          "There was a problem sending to that email address. Please check your email address and try again."
        )
    }
  }

  async function createAccount() {
    // validate username
    const username = newUserUsernameInput.current.inputRef.current.value
    if (!username)
      return alert("Please enter a username.")
    const validUserExp = new RegExp(/^([a-zA-Z0-9_]+)$/)
    const validUsername = validUserExp.test(
      username
    )
    // if (username.length < 4)
    //   return alert(
    //     "Usernames must be 3 characters or more."
    //   )
    if (!validUsername)
      return alert(
        "Please enter a valid username in the correct format (only letters, numbers, and underscores are allowed)."
      )
    
    // validate email address
    if (!newUserEmailInput.current.inputRef.current.value)
      return alert("Please enter an email address.")
    const validEmail = validate.isEmail(
      newUserEmailInput.current.inputRef.current.value
    )
    if (!validEmail) return alert("This is not a valid email address!")

    const createUserResponse = await createUser(
      newUserEmailInput.current.inputRef.current.value,
      newUserUsernameInput.current.inputRef.current.value
    )
    const { data: response } = createUserResponse || {}
    console.log({response})
    if (!response)
      alert(
        "There was a problem creating an account with this information. Please check your username and email address and try again."
      )
    else if (response.error) alert(response.error)
    else if (createUserResponse.status === 200) {
      setLoginLinkSent(true)
      setEmail(newUserEmailInput.current.inputRef.current.value)
    } else
      alert(
        "There was a problem creating an account with this information. Please check your username and email address and try again."
      )
  }

  const ModalContent = () => (
    <div className="authenticate">
      <div style={{ display: loginLinkSent ? "block" : "none" }}>
        <h2>Please check your inbox for a Login Link.</h2>
        <p>
          If you do not see the email we just sent, please check your spam
          folder.
        </p>
      </div>

      <div
        style={{
          display: !user || loginLinkSent ? "none" : "block",
        }}
      >
        <h4>{userEmail}</h4>
      </div>

      <div
        style={{
          display: user || loginLinkSent ? "none" : "block",
        }}
      >
        <Form
          style={{
            display: showLogin ? "none" : "block",
          }}
          onSubmit={e => {
            e.preventDefault()
          }}
        >
          <h2>Create an Account</h2>

          <Form.Field>
            <Input
              ref={newUserUsernameInput}
              name="username"
              type="text"
              placeholder="choose a username (letters, numbers, and underscores allowed)"
            />
          </Form.Field>

          <Form.Field>
            <Input
              ref={newUserEmailInput}
              name="email"
              type="text"
              placeholder="email address"
            />
          </Form.Field>
          <p>
            <button className="primary" onClick={createAccount}>
              Create My Account
            </button>
          </p>
        </Form>
        <Form
          style={{
            display: !showLogin || loginLinkSent ? "none" : "block",
          }}
          onSubmit={e => {
            e.preventDefault()
          }}
        >
          <h2>Log In</h2>
          <Form.Field>
            <Input
              ref={emailInput}
              name="email"
              type="text"
              placeholder="email address"
              defaultValue={email}
            />
          </Form.Field>
          <Form.Field>
            <button className="primary" onClick={logIn}>
              Send me a Login Link
            </button>
          </Form.Field>
        </Form>
        <div
          style={{
            marginTop: 45,
            marginBottom: 30,
            borderTop: "1px solid #ccc",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              marginTop: -12,
              marginRight: "auto",
              marginLeft: "auto",
              backgroundColor: "white",
              width: 45,
            }}
          >
            OR
          </div>
        </div>
        <a
          className="button"
          style={{
            display: showLogin ? "inline-block" : "none",
          }}
          onClick={() => {
            setShowLogin(null)
          }}
        >
          Sign Up
        </a>
        <a
          className="button"
          style={{
            display: showLogin ? "none" : "inline-block",
          }}
          onClick={() => {
            setShowLogin(true)
          }}
        >
          Log In
        </a>
      </div>

      <p style={{ display: user ? "block" : "none", paddingTop: 30 }}>
        <button onClick={logOut}>Log Out</button>
      </p>
    </div>
  )

  return (
    <Modal
      style={{ zIndex: 2 }}
      className="profile-modal"
      alignControls="center"
      closeOnDimmerClick={false}
      startOpen={true}
      ModalHeader={
        <div>
          <a onClick={close} className="top-button close">
            <span className="icon-container">
              <FontAwesomeIcon className="icon" icon={faTimes} />
            </span>
          </a>

          {user ? (
            <h3>Welcome, {username}</h3>
          ) : (
            <h3>Please Log In or Sign Up</h3>
          )}
        </div>
      }
      ModalContent={<ModalContent />}
    />
  )
}

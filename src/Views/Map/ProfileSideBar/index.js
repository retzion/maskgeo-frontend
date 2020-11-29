import React, { useRef, useState } from "react"
import Sidebar from "react-sidebar"
import validate from "validator"
import UniversalCookie from "universal-cookie"

// helpers
import { cookieNames } from "../../../config"
import { createUser, requestMagicLoginLink } from "../../../util/MaskGeoApi"

// styles
import "./index.css"
const styles = {
  close: {
    float: "right",
    cursor: "pointer",
    margin: "0 0 12px 12px",
    fontSize: "2rem",
    textShadow: "2px 2px #ccc",
  },
  container: {
    fontSize: "1rem",
    textAlign: "left",
    minWidth: "240px",
  },
  title: {
    fontSize: "1.5rem",
  },
  icon: { height: 24, marginRight: 9 },
  address: {
    fontSize: "1rem",
  },
  input: { padding: 9, width: "90%", marginBottom: 6 },
}

const Cookies = new UniversalCookie()

export default function ProfileSideBar({ close, logOut, user }) {
  const { email: userEmail, username } = user || {}

  const [email, setEmailState] = useState(null)
  const [loginLinkSent, setLoginLinkSent] = useState(null)
  const [showLogin, setShowLogin] = useState(null)
  // const [userCreated, setUserCreated] = useState(null)

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
    console.log({
      email,
      inputValue,
      cookieValue,
    })

    const expires = new Date().addDays(90)
    if (inputValue != cookieValue)
      Cookies.set(cookieNames.email, inputValue, { expires, path: "/" })
    if (inputValue != email) setEmailState(inputValue)
    if (inputValue && inputValue.length) setShowLogin(true)
  }

  async function logIn() {
    const valid = validate.isEmail(emailInput.current.value)
    if (!valid) alert("This is not a valid email address!")
    else {
      const currentEmailValue = emailInput.current.value
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
    if (!newUserUsernameInput.current.value)
      return alert("Please enter a username.")
    const validUserExp = new RegExp(/^([a-zA-Z0-9_]+)$/)
    const validUsername = validUserExp.test(newUserUsernameInput.current.value)
    if (!validUsername)
      return alert(
        "Please enter a valid username in the correct format (only letters, numbers, and underscores are allowed)."
      )

    // validate email address
    if (!newUserEmailInput.current.value)
      return alert("Please enter an email address.")
    const validEmail = validate.isEmail(newUserEmailInput.current.value)
    if (!validEmail) return alert("This is not a valid email address!")

    const createUserResponse = await createUser(
      newUserEmailInput.current.value,
      newUserUsernameInput.current.value
    ).catch(console.error)
    const { data: response } = createUserResponse || {}
    if (!response)
      alert(
        "There was a problem creating an account with this information. Please check your username and email address and try again."
      )
    else if (response.error) alert(response.error)
    else if (createUserResponse.status === 200) {
      setLoginLinkSent(true)
      setEmail(newUserEmailInput.current.value)
    } else
      alert(
        "There was a problem creating an account with this information. Please check your username and email address and try again."
      )
  }

  const SidebarContent = () => (
    <div className="authenticate open-sidebar">
      <a onClick={close} style={styles.close}>
        ✖️
      </a>

      <div style={styles.container}>
        <div style={{ display: user ? "block" : "none" }}>
          <h2>Welcome, {username}!</h2>
          <h3 style={styles.address}>{userEmail}</h3>
        </div>

        <div style={{ display: loginLinkSent ? "block" : "none" }}>
          <h2>Please check your inbox for a Login Link.</h2>
          <p>
            If you do not see the email we just sent, please check your spam
            folder.
          </p>
        </div>

        <div
          style={{
            display: user || loginLinkSent ? "none" : "block",
            marginTop: 45,
          }}
        >
          <form
            style={{
              display: showLogin ? "none" : "block",
            }}
            onSubmit={e => {
              e.preventDefault()
            }}
          >
            <h2>Create an Account</h2>
            <input
              ref={newUserUsernameInput}
              name="username"
              type="text"
              style={styles.input}
              placeholder="choose a username (letters, numbers, and underscores allowed)"
            />
            <input
              ref={newUserEmailInput}
              name="email"
              type="text"
              style={styles.input}
              placeholder="email address"
            />
            <p>
              <button className="primary" onClick={createAccount}>
                Create My Account
              </button>
            </p>
          </form>
          <form
            style={{
              display: !showLogin || loginLinkSent ? "none" : "block",
            }}
            onSubmit={e => {
              e.preventDefault()
            }}
          >
            <h2>Log In</h2>
            <input
              ref={emailInput}
              name="email"
              type="text"
              style={styles.input}
              placeholder="email address"
              defaultValue={email}
            />
            <p>
              <button className="primary" onClick={logIn}>
                Send me a Login Link
              </button>
            </p>
          </form>
          <div
            style={{
              marginTop: 45,
              marginBottom: 30,
              borderTop: "1px solid #ccc",
              textAlign: "center",
              width: "93%",
            }}
          >
            <div
              style={{
                marginTop: -9,
                marginRight: "auto",
                marginLeft: "auto",
                backgroundColor: "white",
                width: 45,
                // display: 'inline-table',
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
    </div>
  )

  return (
    <Sidebar
      sidebar={<SidebarContent />}
      open={true}
      children={[]}
      pullRight={true}
      styles={{
        sidebar: {
          background: "white",
          width: "100%",
          maxWidth: 550,
        },
      }}
    />
  )
}

import React from "react"
import { useState } from "react"
import Sidebar from "react-sidebar"
import validate from "validator"

import { createUser, requestMagicLoginLink, decryptToken } from "../../util/MaskGeoApi"

const styles = {
  sidebar: {
    // overlay: { display: "none" },
    sidebar: {
      background: "white",
      width: "99%",
      maxWidth: 550,
    },
  },
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
  button: { padding: "15px 21px", fontSize: "1rem" },
}

export default function ProfileSideBar(props) {
  const [loginLinkSent, setLoginLinkSent] = useState(null)
  const [userCreated, setUserCreated] = useState(null)

  const { close, logOut, user } = props
  const { email, username } = user || {}

  let emailInput, newUserEmailInput, newUserUsernameInput

  async function logIn() {
    const valid = validate.isEmail(emailInput.value)
    if (!valid) alert("This is not a valid email address!")
    else {
      const magicLinkResponse = await requestMagicLoginLink(emailInput.value)
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
    if (!newUserUsernameInput.value) return alert("Please enter a username.")
    const validUserExp = new RegExp(/^([a-zA-Z0-9_]+)$/)
    const validUsername = validUserExp.test(newUserUsernameInput.value)
    if (!validUsername)
      return alert(
        "Please enter a valid username in the correct format (only letters, numbers, and underscores are allowed)."
      )

    // validate email address
    if (!newUserEmailInput.value) return alert("Please enter an email address.")
    const validEmail = validate.isEmail(newUserEmailInput.value)
    if (!validEmail) return alert("This is not a valid email address!")

    const createUserResponse = await createUser(
      newUserEmailInput.value,
      newUserUsernameInput.value
    ).catch(console.error)
    console.log({createUserResponse})
    const { data: response } = createUserResponse || {}
    if (!response)
      alert(
        "There was a problem creating an account with this information. Please check your username and email address and try again."
      )
    else if (response.error) alert(response.error)
    else if (createUserResponse.status === 200) setLoginLinkSent(true)
    else
      alert(
        "There was a problem creating an account with this information. Please check your username and email address and try again."
      )
  }

  const SidebarContent = () => (
    <div
      style={{
        padding: 12,
      }}
    >
      <a onClick={close} style={styles.close}>
        ✖️
      </a>
      <div style={styles.container}>
        <h1 style={styles.title}>{username}</h1>
        <h2 style={styles.address}>{email}</h2>
        <div style={{ display: loginLinkSent ? "block" : "none" }}>
          <h2>Please check your inbox for a Login Link.</h2>
        </div>
        <div style={{ display: user || loginLinkSent ? "none" : "block", marginTop: 45 }}>
          <form
            style={{ display: loginLinkSent ? "none" : "block" }}
            onSubmit={e => {
              e.preventDefault()
            }}
          >
            <h2>Log In</h2>
            <input
              ref={r => (emailInput = r)}
              name="email"
              type="text"
              style={styles.input}
              placeholder="email address"
              // value={emailValue}
              // onChange={emailHandle}
            />
            <p>
              <button className="primary" style={styles.button} onClick={logIn}>
                Send me a Login Link
              </button>
            </p>
          </form>
          <div
            style={{
              marginTop: 45,
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
          <form
            style={{ display: userCreated ? "none" : "block" }}
            onSubmit={e => {
              e.preventDefault()
            }}
          >
            <h2>Create an Account</h2>
            <input
              ref={r => (newUserUsernameInput = r)}
              name="username"
              type="text"
              style={styles.input}
              placeholder="choose a username (letters, numbers, and underscores allowed)"
            />
            <input
              ref={r => (newUserEmailInput = r)}
              name="email"
              type="text"
              style={styles.input}
              placeholder="email address"
            />
            <p>
              <button
                className="primary"
                style={styles.button}
                onClick={createAccount}
              >
                Create My Account
              </button>
            </p>
          </form>
        </div>
        <p style={{ display: user ? "block" : "none" }}>
          <button onClick={logOut}>Log Out</button>
          <button onClick={decryptToken}>verify</button>
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
      styles={styles.sidebar}
    />
  )
}

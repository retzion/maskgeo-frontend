import React, { useRef, useState } from "react"
import validate from "validator"
import UniversalCookie from "universal-cookie"
import { Button, Dropdown, Form, Icon, Input, Segment } from "semantic-ui-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheck,
  faExclamationCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"

// components
import Loader from "../Loader"
import LoginForm from "./LoginForm"

// helpers
import { cookieNames } from "../../config"
import {
  addUserPhone,
  createUser,
  processToken,
  requestMagicLoginLink,
} from "../../util/MaskGeoApi"
import Modal from "../Modal"
import { validatePhone } from "../../util/TwilioApi"

// styles
import "./index.css"

const Cookies = new UniversalCookie()

export default function ProfileSideBar({ close, logOut, setUser, user }) {
  const { email: userEmail, phone: userPhone, username } = user || {}

  const [loginLinkSent, setLoginLinkSent] = useState(null)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserPhone, setNewUserPhone] = useState("")
  const [newUserUsername, setNewUserUsername] = useState("")
  const [phoneValid, setPhoneValid] = useState(
    !newUserPhone || validatePhone(newUserPhone)
  )
  const [showLoader, setShowLoader] = useState(false)
  const [showLogin, setShowLogin] = useState(
    Cookies.get(cookieNames.email) || Cookies.get(cookieNames.phone)
  )
  const [showTokenForm, setShowTokenForm] = useState(null)
  const [userMessage, setUserMessage] = useState(null)

  const phoneInput = useRef()
  const loginTokenInput = useRef()
  const tokenInput = useRef()
  const newUserUsernameInput = useRef()
  const newUserEmailInput = useRef()

  function setEmailCookie(inputValue) {
    const cookieValue = Cookies.get(cookieNames.email)

    const expires = new Date().addDays(90)
    if (inputValue != cookieValue)
      Cookies.set(cookieNames.email, inputValue, { expires, path: "/" })
  }

  async function createAccount() {
    setShowLoader(true)
    // validate username
    const username = newUserUsernameInput.current.inputRef.current.value
    if (!username) return alert("Please enter a username.")
    const validUserExp = new RegExp(/^([a-zA-Z0-9_]+)$/)
    const validUsername = validUserExp.test(username)
    if (username.length < 3)
      return alert("Usernames must be 3 characters or more.")
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
    else setEmailCookie(newUserEmailInput.current.inputRef.current.value)

    // save valid phone to cookie if included
    if (newUserPhone && phoneValid) Cookies.set(cookieNames.phone, newUserPhone)

    // create user
    const createUserResponse = await createUser(
      newUserEmailInput.current.inputRef.current.value,
      newUserUsernameInput.current.inputRef.current.value,
      // validate phone inline
      newUserPhone && phoneValid && newUserPhone
    )
    const { data: response } = createUserResponse || {}
    if (!response)
      alert(
        "There was a problem creating an account with this information. Please check your username and email address and try again."
      )
    else if (response.error) alert(response.error)
    else if (createUserResponse.status === 200) {
      setLoginLinkSent("email")
      setShowLogin(true)
    } else
      alert(
        "There was a problem creating an account with this information. Please check your username and email address and try again."
      )
    setShowLoader(null)
  }

  async function processLoginToken(inputRef) {
    const token = inputRef.current.inputRef.current.value
    if (!token) return

    setShowLoader(true)

    const authUser = await ProcessToken(token)
    if (!authUser || !authUser.user) alert("Token is not valid.")
    else {
      setUser(authUser.user)
      close()
    }

    setShowLoader(null)
  }

  const TokenForm = ({ inputRef }) => {
    return (
      <Form
        onSubmit={e => e.preventDefault}
        style={{ display: "grid", gridTemplateColumns: "3fr 1fr" }}
      >
        <Input
          ref={inputRef}
          style={{ marginRight: 12 }}
          placeholder={`Paste your token here`}
        />

        <Button
          content="Go"
          primary
          onClick={() => {
            processLoginToken(inputRef)
          }}
        />
      </Form>
    )
  }

  function phoneChangeHandler() {
    let phoneInputValue = phoneInput.current.inputRef.current.value || ""
    if (!phoneInputValue.startsWith("+"))
      phoneInputValue = `+${phoneInputValue}`
    const validChars = "0123456789+"
    for (let i = 0; i < phoneInputValue.length; i++) {
      const char = phoneInputValue[i]
      if (!validChars.includes(char))
        phoneInputValue = phoneInputValue.split(char).join("")
    }

    const valid = validatePhone(phoneInputValue)
    if (valid != phoneValid) setPhoneValid(valid)
    if (newUserPhone != phoneInputValue) {
      setNewUserPhone(phoneInputValue)
      setTimeout(() => {
        phoneInput.current.focus()
      }, 0)
    }
  }

  const ModalContent = () => (
    <div className="authenticate">
      {userMessage && <Segment color="red">{userMessage}</Segment>}

      <div style={{ display: loginLinkSent ? "block" : "none" }}>
        <h2>Please check your {loginLinkSent === "email" ? "inbox" : "phone"} for a Login Link.</h2>

        {loginLinkSent === "email" && <p>
          If you do not see the email we just sent, please check your spam
          folder.
        </p>}

        <hr
          style={{
            border: "none",
            height: 2,
            backgroundColor: "#eaeaea",
            margin: "30px 0",
          }}
        />

        <p>You may also copy/paste the token we send you to this field:</p>

        <TokenForm inputRef={loginTokenInput} />

        <br />
      </div>

      <Form
        style={{
          display: !user || loginLinkSent ? "none" : "block",
        }}
      >
        <Form.Field>
          <Input
            label="Username"
            value={username}
            onFocus={({ target }) => {
              target.blur()
            }}
          />
        </Form.Field>
        <Form.Field>
          <Input
            action={{
              style: { cursor: user && user.emailVerified ? "default" : "pointer" },
              icon: user && user.emailVerified ? (
                <FontAwesomeIcon
                  className="icon"
                  icon={faCheck}
                  color="#009900"
                  title="Verified Email"
                />
              ) : (
                <Dropdown
                  onClose={async e => {
                    if (e && e.target) {
                      setUserMessage(null)
                      // request token to verify email address
                      const { data: updatedUser } = await requestMagicLoginLink({
                        email: userEmail,
                      })
                      if (!updatedUser || updatedUser.error)
                        setUserMessage(
                          <span>
                            <Icon
                              name="close"
                              style={{ float: "right", cursor: "pointer" }}
                              onClick={() => {
                                setUserMessage(null)
                              }}
                            />
                            {updatedUser.error}
                          </span>
                        )
                      else
                        setUserMessage(
                          <span>
                            <Icon
                              name="close"
                              style={{ float: "right", cursor: "pointer" }}
                              onClick={() => {
                                setUserMessage(null)
                              }}
                            />
                            Please check your inbox for a verification link.
                          </span>
                        )
                    }
                  }}
                  direction="left"
                  inline
                  icon={
                    <FontAwesomeIcon
                      className="icon"
                      icon={faExclamationCircle}
                      color="#990000"
                    />
                  }
                  options={[{ key: "a", text: "Resend verification link" }]}
                />
              ),
            }}
            label="Email"
            value={userEmail}
            onFocus={({ target }) => {
              target.blur()
            }}
          />
        </Form.Field>
        {userPhone && (
          <Form.Field>
            <Input
              action={{
                style: { cursor: user.phoneVerified ? "default" : "pointer" },
                icon: user.phoneVerified ? (
                  <FontAwesomeIcon
                    className="icon"
                    icon={faCheck}
                    color="#009900"
                    title="Verified Phone"
                  />
                ) : (
                  <Dropdown
                    onClose={async e => {
                      if (e && e.target) {
                        setUserMessage(null)
                        // request token to verify phone number
                        const { data: updatedUser } = await addUserPhone(
                          userPhone,
                          true
                        )
                        if (!updatedUser || updatedUser.error)
                          setUserMessage(
                            <span>
                              <Icon
                                name="close"
                                style={{ float: "right", cursor: "pointer" }}
                                onClick={() => {
                                  setUserMessage(null)
                                }}
                              />
                              {updatedUser.error}
                            </span>
                          )
                        else
                          setUserMessage(
                            <span>
                              <Icon
                                name="close"
                                style={{ float: "right", cursor: "pointer" }}
                                onClick={() => {
                                  setUserMessage(null)
                                }}
                              />
                              Please check your text messages for a verification
                              link.
                            </span>
                          )
                      }
                    }}
                    direction="left"
                    inline
                    icon={
                      <FontAwesomeIcon
                        className="icon"
                        icon={faExclamationCircle}
                        color="#990000"
                      />
                    }
                    options={[{ key: "a", text: "Resend verification link" }]}
                  />
                ),
              }}
              label="Phone"
              value={userPhone}
              onFocus={({ target }) => {
                target.blur()
              }}
            />
          </Form.Field>
        )}
        {!userPhone && (
          <Form.Field>
            <Input
              action={{
                color: "blue",
                labelPosition: "left",
                icon: "plus",
                content: "Add Phone",
                onClick: async ({ target }) => {
                  setShowLoader(true)
                  setUserMessage(null)
                  const phone = target.parentNode.children[1]["value"]
                  const { data: updatedUser } = await addUserPhone(phone)
                  if (updatedUser.error) alert(updatedUser.error)
                  else
                    setUser({
                      ...user,
                      phone,
                    })
                  setShowLoader(null)
                  setUserMessage(
                    <span>
                      <Icon
                        name="close"
                        style={{ float: "right", cursor: "pointer" }}
                        onClick={() => {
                          setUserMessage(null)
                        }}
                      />
                      Please check your text messages for a verification link.
                    </span>
                  )
                },
              }}
              actionPosition="left"
              placeholder="phone number (ex: +18005551212)"
              defaultValue=""
              onChange={({ target }) => {
                const validChars = "0123456789"
                for (let i = 0; i < target.value.length; i++) {
                  const char = target.value[i]
                  if (!validChars.includes(char))
                    target.value = target.value.split(char).join("")
                }
                target.value = "+" + target.value

                if (!validatePhone(target.value))
                  target.parentNode.parentNode.classList.add("error")
                else target.parentNode.parentNode.classList.remove("error")
              }}
            />
          </Form.Field>
        )}
      </Form>

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

          <span className="signup-field-note">* required</span>
          <Form.Field className="signup-field">
            <Input
              ref={newUserUsernameInput}
              name="username"
              onChange={({ target }) => {
                setNewUserUsername(target.value)
                setTimeout(() => {
                  newUserUsernameInput.current.focus()
                }, 0)
              }}
              type="text"
              value={newUserUsername}
              placeholder="choose a username (letters, numbers, and underscores allowed)"
            />
          </Form.Field>

          <Form.Field>
            <span className="signup-field-note">* required</span>
            <Input
              ref={newUserEmailInput}
              name="email"
              onChange={({ target }) => {
                setNewUserEmail(target.value)
                setTimeout(() => {
                  newUserEmailInput.current.focus()
                }, 0)
              }}
              type="email"
              value={newUserEmail}
              placeholder="email address"
            />
          </Form.Field>

          <Form.Field className={phoneValid ? "" : "error"}>
            <span className="signup-field-note">(optional)</span>

            <Input
              ref={phoneInput}
              name="phone"
              type="tel"
              placeholder="phone number (ex: +18005551212)"
              value={newUserPhone}
              onChange={phoneChangeHandler}
              // onBlur={({ target }) => {
              //   setNewUserPhone(target.value)
              // }}
              // error={!phoneValid}
            />
          </Form.Field>

          <p>
            <button className="primary" onClick={createAccount}>
              Create My Account
            </button>
          </p>
        </Form>

        {showLogin && (
          <LoginForm
            // email={email}
            // setEmail={setEmail}
            // setEmailState={setEmailState}
            setShowLoader={setShowLoader}
            setLoginLinkSent={setLoginLinkSent}
            setShowLogin={setShowLogin}
            setShowTokenForm={setShowTokenForm}
            showTokenForm={showTokenForm}
            user={user}
            visible={showLogin || loginLinkSent}
          />
        )}

        <div
          style={{
            display:
              showLogin && (loginLinkSent || showTokenForm) ? "block" : "none",
          }}
        >
          <p style={{ marginTop: 36 }}>Have a Token already? Paste it here:</p>

          <TokenForm inputRef={tokenInput} />
        </div>

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
            setShowLogin(false)
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
        <a style={{ cursor: "pointer", padding: 12 }} onClick={logOut}>
          Log Out
        </a>
      </p>
    </div>
  )

  if (showLoader) return <Loader />
  else
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
              <h3>Account Details</h3>
            ) : (
              <h3>Please Log In or Sign Up</h3>
            )}
          </div>
        }
        ModalContent={<ModalContent />}
      />
    )
}

async function ProcessToken(token) {
  /** Send token to backend to retrieve JWT */
  const response = await processToken(token)
  const valid = response && response.status === 200 && response.data

  if (!valid) return
  else return response.data
}

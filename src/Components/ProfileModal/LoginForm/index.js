import React, { useRef, useState } from "react"
import validate from "validator"
import UniversalCookie from "universal-cookie"
import { Button, Form, Input, Tab } from "semantic-ui-react"

// helpers
import { cookieNames } from "../../../config"
import { requestMagicLoginLink } from "../../../util/MaskGeoApi"
import { validatePhone } from "../../../util/TwilioApi"

const Cookies = new UniversalCookie()

export default ({
  setShowLoader,
  setLoginLinkSent,
  setShowLogin,
  setShowTokenForm,
  showTokenForm,
  visible,
}) => {
  const [authUsing, setAuthUsing] = useState("email")
  const [email, setEmailState] = useState("")
  const [phone, setPhoneState] = useState("")
  const [phoneValid, setPhoneValid] = useState(null)

  const emailInput = useRef()
  const phoneInput = useRef()

  React.useEffect(() => {
    const emailCookieValue = Cookies.get(cookieNames.email)
    if (emailInput.current) emailInput.current.value = emailCookieValue
    if (email != emailCookieValue) setEmailState(emailCookieValue)
    if (emailCookieValue && emailCookieValue.length) setShowLogin(true)
    const phoneCookieValue = Cookies.get(cookieNames.phone)
    if (phoneInput.current) phoneInput.current.value = phoneCookieValue
    if (phone != phoneCookieValue) setPhoneState(phoneCookieValue)
    if (phoneCookieValue && phoneCookieValue.length) setShowLogin(true)
    if (
      phoneCookieValue &&
      phoneCookieValue.length &&
      validatePhone(phoneCookieValue)
    )
      setPhoneValid(true)
  }, [])

  function setEmail(inputValue) {
    const cookieValue = Cookies.get(cookieNames.email)

    const expires = new Date().addDays(90)
    if (inputValue != cookieValue)
      Cookies.set(cookieNames.email, inputValue, { expires, path: "/" })
    if (inputValue != email) setEmailState(inputValue)
    if (inputValue && inputValue.length) setShowLogin(true)
  }

  function setPhone(inputValue) {
    const cookieValue = Cookies.get(cookieNames.phone)

    const expires = new Date().addDays(90)
    if (inputValue != cookieValue)
      Cookies.set(cookieNames.phone, inputValue, { expires, path: "/" })
    if (inputValue != phone) setPhoneState(inputValue)
    if (inputValue && inputValue.length) setShowLogin(true)
  }

  function emailChangeHandler() {
    let emailInputValue = emailInput.current.inputRef.current.value || ""
    if (email != emailInputValue) setEmailState(emailInputValue)
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
    if (phone != phoneInputValue) setPhoneState(phoneInputValue)
  }

  async function logIn() {
    setShowLoader(true)

    const usingEmail = authUsing === "email"
    if (usingEmail) {
      const validEmail = validate.isEmail(email)

      if (!validEmail) alert("This is not a valid email address!")
      else {
        const magicLinkResponse = await requestMagicLoginLink({
          email,
        })

        setEmail(email)

        if (magicLinkResponse && magicLinkResponse.status === 200)
          setLoginLinkSent(true)
        else
          alert(
            "There was a problem sending to that email address. Please check your email address and try again."
          )
      }
    } else {
      if (!phoneValid) alert("This is not a valid phone number!")
      else {
        const magicLinkResponse = await requestMagicLoginLink({
          phone,
        })

        setPhone(phone)

        if (magicLinkResponse && magicLinkResponse.status === 200)
          setLoginLinkSent(true)
        else
          alert(
            "There was a problem sending to that phone number. Please check your phone number and format and try again."
          )
      }
    }

    setShowLoader(null)
  }

  const panes = [
    {
      menuItem: "Email",
      render: () => {
        setAuthUsing("email")
        return (
          <Tab.Pane attached={false}>
            <Input
              ref={emailInput}
              name="email"
              type="email"
              placeholder="email address"
              value={email}
              onChange={emailChangeHandler}
            />
          </Tab.Pane>
        )
      },
    },
    {
      menuItem: "Phone",
      render: () => {
        setAuthUsing("phone")
        return (
          <Tab.Pane
            attached={false}
            style={{
              backgroundColor: phoneValid == false ? "#ffefef" : "inherit",
            }}
          >
            <p>
              If you have saved an optional phone number in your account, you
              can send a login link to your number. If you are having trouble,
              you may not have saved a phone number. Try logging in with your
              email.
            </p>
            <Input
              ref={phoneInput}
              name="phone"
              type="tel"
              placeholder="phone number (ex: +18005551212)"
              value={phone}
              onChange={phoneChangeHandler}
              error={phoneValid == false}
            />
            <div
              style={{
                display: phoneValid == false ? "block" : "none",
                color: "red",
                fontStyle: "italic",
                marginTop: 6,
              }}
            >
              invalid number
            </div>
          </Tab.Pane>
        )
      },
    },
  ]

  if (showTokenForm)
    return (
      <a
        onClick={() => {
          setShowTokenForm(false)
        }}
        style={{
          cursor: "pointer",
          // float: "right",
        }}
      >
        &lsaquo; back to Log In
      </a>
    )
  else
    return (
      <Form
        style={{
          display: visible ? "block" : "none",
        }}
        onSubmit={e => {
          e.preventDefault()
        }}
      >
        <h2>Log In</h2>
        <Form.Field>
          <Tab
            menu={{ pointing: true }}
            panes={panes}
            defaultActiveIndex={
              !Cookies.get(cookieNames.email) && Cookies.get(cookieNames.phone)
                ? 1
                : 0
            }
          />
        </Form.Field>
        <Form.Field style={{ paddingTop: 21 }}>
          <a
            onClick={() => {
              setShowTokenForm(true)
            }}
            style={{
              cursor: "pointer",
              float: "right",
              marginTop: 15,
            }}
          >
            Use a Token you already have
          </a>
          <Button primary onClick={logIn}>
            Send me a Login Token &amp; Link
          </Button>
        </Form.Field>
      </Form>
    )
}

import axios from "axios"
import validate from "validator"

import { maskGeoApiUri } from "../../config"

const apiUri = maskGeoApiUri()

const allowedHeaders = document.location.protocol === 'https' ? "*; SameSite=None; Secure" : "*; SameSite=Lax;"
const universalHeaders = {
  "API-KEY": process.env["REACT_APP_MASKGEO_API_KEY"],
  "Content-Type": "application/json",
  // "Access-Control-Request-Headers": allowedHeaders,
}
axios.defaults.withCredentials = true

/**
 * @title POST New user account
 * @dev Get a JSON Web Token from a valid `login token`
 *
 * @param {string} email User's email address
 * @param {string} username Desired username
 */
function createUser(email, username) {
  return post(`${apiUri}/user`, {
    email,
    username,
  }).catch(console.error)
}

/**
 * @title GET Token
 * @dev Get a JSON Web Token from a valid `login token`
 *
 * @param {string} token A token used to log in and retrieve a JWT
 */
function processToken(token) {
  return get(`${apiUri}/jwt/${token}`).catch(console.error)
}

/**
 * @title DELETE Token
 * @dev Delete JSON Web Tokens
 */
function removeToken() {
  return del(`${apiUri}/jwt`).catch(console.error)
}

/**
 * @title HEAD Token
 * @dev Verify JSON Web Token
 */
function verifyToken() {
  return head(`${apiUri}/jwt`).catch(console.error)
}

/**
 * @title GET Token Data
 * @dev Verify JSON Web Token and return decrypted data
 */
function decryptToken() {
  return get(`${apiUri}/data`).catch(console.error)
}

/**
 * @title GET Magic login link emailed to user
 * @dev Verify JSON Web Token and return decrypted data
 *
 * @param {string} email User's email address
 */
function requestMagicLoginLink(email) {
  if (!email || !validate.isEmail(email))
    return new Error("Email address is not valid.")
  return get(`${apiUri}/login/${email}`).catch(console.error)
}

/** @return Promises resolving to javascript objects */
async function get(url, options) {
  let headers
  if (options && options.headers) headers = options.headers
  return axios.get(url, {
    ...options,
    // withCredentials: true,
    headers: {
      ...universalHeaders,
      ...headers,
    },
  })
}
async function head(url, options) {
  let headers
  if (options && options.headers) headers = options.headers
  return axios.head(url, {
    ...options,
    // withCredentials: true,
    headers: {
      ...universalHeaders,
      ...headers,
    },
  })
}
async function post(url, data) {
  return axios.post(url, data, {
    // withCredentials: true,
    headers: universalHeaders,
  })
}
async function put(url, data) {
  return axios.put(url, data, {
    withCredentials: true,
    headers: universalHeaders,
  })
}
function del(url) {
  return axios.delete(url, {
    // withCredentials: true,
    headers: universalHeaders,
  })
}
async function asyncDel(url) {
  return axios.delete(url, {
    // withCredentials: true,
    headers: universalHeaders,
  })
}

export {
  createUser,
  decryptToken,
  processToken,
  removeToken,
  requestMagicLoginLink,
  verifyToken,
}


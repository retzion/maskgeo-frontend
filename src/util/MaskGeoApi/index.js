import axios from "axios"
import validate from "validator"

import { maskGeoApiUri } from "../../config"

/**
 * @title POST New user account
 * @dev Get a JSON Web Token from a valid `login token`
 *
 * @param {string} email User's email address
 * @param {string} username Desired username
 */
function createUser(email, username) {
  return post(`${maskGeoApiUri}/user`, {
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
  return get(`${maskGeoApiUri}/jwt/${token}`).catch(console.error)
}

/**
 * @title DELETE Token
 * @dev Delete JSON Web Tokens
 */
function removeToken() {
  return del(`${maskGeoApiUri}/jwt`).catch(console.error)
}

/**
 * @title HEAD Token
 * @dev Verify JSON Web Token
 */
function verifyToken() {
  return head(`${maskGeoApiUri}/jwt`).catch(console.error)
}

/**
 * @title GET Token Data
 * @dev Verify JSON Web Token and return decrypted data
 */
function decryptToken() {
  return get(`${maskGeoApiUri}/data`).catch(console.error)
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
  return get(`${maskGeoApiUri}/login/${email}`).catch(console.error)
}

/** @return Promises resolving to javascript objects */
async function get(url, options) {
  let headers
  if (options && options.headers) headers = options.headers
  return axios.get(url, {
    ...options,
    withCredentials: true,
    headers: {
      "API-KEY": process.env["REACT_APP_MASKGEO_API_KEY"],
      ...headers,
    },
  })
}
async function head(url, options) {
  let headers
  if (options && options.headers) headers = options.headers
  return axios.head(url, {
    ...options,
    withCredentials: true,
    headers: {
      "API-KEY": process.env["REACT_APP_MASKGEO_API_KEY"],
      ...headers,
    },
  })
}
async function post(url, data) {
  return axios.post(url, data, {
    withCredentials: true,
    headers: {
      "API-KEY": process.env["REACT_APP_MASKGEO_API_KEY"],
      "Content-Type": "application/json",
    },
  })
}
async function put(url, data) {
  return axios.put(url, data, {
    withCredentials: true,
    headers: {
      "API-KEY": process.env["REACT_APP_MASKGEO_API_KEY"],
      "Content-Type": "application/json",
    },
  })
}
function del(url) {
  return axios.delete(url, {
    withCredentials: true,
    headers: {
      "API-KEY": process.env["REACT_APP_MASKGEO_API_KEY"],
      "Content-Type": "application/json",
    },
  })
}
async function asyncDel(url) {
  return axios.delete(url, {
    withCredentials: true,
    headers: {
      "API-KEY": process.env["REACT_APP_MASKGEO_API_KEY"],
      "Content-Type": "application/json",
    },
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

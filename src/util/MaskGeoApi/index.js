import axios from "axios"
import validate from "validator"

import { maskGeoApiUri } from "../../config"
import storage from "../../util/LocalStorage"

import { version as appVersion } from "../../../package.json"

const apiUri = maskGeoApiUri()

let accessToken = storage.getData("accessToken")
let universalHeaders = {
  "API-KEY": process.env["REACT_APP_MASKGEO_API_KEY"],
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "X-App-Version": appVersion,
}
if (accessToken) universalHeaders["Authorization"] = `Bearer ${accessToken}`
axios.defaults.withCredentials = true

/**
 * @title POST Client errors
 * @dev Log error data in tthe database
 *
 * @param {object} payload Error code, message, and metadata
 */
function logError(payload) {
  return post(`${apiUri}/error`, payload).catch(() => null)
}

/**
 * @title POST New user account
 * @dev Get a JSON Web Token from a valid `login token`
 *
 * @param {string} email User's email address
 * @param {string} username Desired username
 */
function createUser(email, username, phone) {
  return post(`${apiUri}/user`, {
    email,
    username,
    phone,
  }).catch(c => c.response)
}

/**
 * @title UPDATE User to add phone number
 * @dev Save a valid phone number to the user object
 *
 * @param {string} phone New, unique phone number
 */
async function addUserPhone(phone, resend) {
  const response = await post(
    `${apiUri}/phone/${phone}${resend ? "?resend=1" : ""}`
  ).catch(c => c.response)
  if (response && response.data && response.data["accessToken"]) {
    accessToken = response.data["accessToken"]
    storage.setData("accessToken", accessToken)
    universalHeaders["Authorization"] = `Bearer ${accessToken}`
  }
  return response
}

/**
 * @title GET Token
 * @dev Get a JSON Web Token from a valid `login token`
 *
 * @param {string} token A token used to log in and retrieve a JWT
 */
async function processToken(token) {
  const response = await get(`${apiUri}/jwt/${token}`).catch(r => r)
  if (response && response.data && response.data["apiVersion"])
    storage.setData("apiVersion", response.data["apiVersion"])
  if (response && response.data && response.data["accessToken"]) {
    accessToken = response.data["accessToken"]
    storage.setData("accessToken", accessToken)
    universalHeaders["Authorization"] = `Bearer ${accessToken}`
  }
  return response
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
async function decryptToken() {
  const response = await get(`${apiUri}/data`).catch(r => r)
  if (response && response.data && response.data["apiVersion"])
    storage.setData("apiVersion", response.data["apiVersion"])
  if (response && response.data && response.data["error"])
    storage.clearStorage("accessToken")
  if (response && response.data && response.data["accessToken"]) {
    accessToken = response.data["accessToken"]
    storage.setData("accessToken", accessToken)
    universalHeaders["Authorization"] = `Bearer ${accessToken}`
  }
  return response
}

/**
 * @title GET Magic login link emailed to user
 * @dev Verify JSON Web Token and return decrypted data
 *
 * @param {string} email User's email address
 */
function requestMagicLoginLink({ email, phone }) {
  if (!email && !phone)
    return new Error("Please enter an email address or phone number.")
  if (email && !validate.isEmail(email))
    return new Error("Email address is not valid.")
  if (phone && !/^\+[1-9]\d{10,14}$/.test(phone))
    return new Error("Phone number is not valid.")
  if (email) return get(`${apiUri}/login/email/${email}`).catch(console.error)
  else if (phone)
    return get(`${apiUri}/login/phone/${phone}`).catch(console.error)
}

/**
 * @title POST Rating and Review
 * @dev Posts a rating and optionally a review for specific coordinates
 *
 * @param {object} reviewData Object containing the review data and rating float
 * @param {object} reviewData.geoCoordinates Geo coordinates object for place being reviewed
 * @param {float} reviewData.geoCoordinates.lat Latitude
 * @param {float} reviewData.geoCoordinates.lng Longitude
 * @param {string} reviewData.googlePlaceId Google Places reference ID
 * @param {float} reviewData.rating Rating between 0 and 5
 * @param {string} reviewData.review (optional) Written review
 * @param {object} reviewData.user User data object
 * @param {string} reviewData.user._id User's MongoDB object ID
 * @param {string} reviewData.user.username User's username
 */
function postReview(reviewData) {
  // return reviewData
  return post(`${apiUri}/review`, reviewData).catch(c => c.response)
}

function fetchReviews(query) {
  return get(`${apiUri}/reviews`, { params: query }).catch(c => c.response)
}

/** @return Promises resolving to javascript objects */
async function get(url, options) {
  let headers
  if (options && options.headers) headers = options.headers
  return axios.get(url, {
    ...options,
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
    headers: {
      ...universalHeaders,
      ...headers,
    },
  })
}
async function post(url, data) {
  return axios.post(url, data, {
    headers: universalHeaders,
  })
}
async function put(url, data) {
  return axios.put(url, data, {
    headers: universalHeaders,
  })
}
function del(url) {
  return axios.delete(url, {
    headers: universalHeaders,
  })
}

export {
  addUserPhone,
  createUser,
  decryptToken,
  fetchReviews,
  logError,
  postReview,
  processToken,
  removeToken,
  requestMagicLoginLink,
  verifyToken,
}

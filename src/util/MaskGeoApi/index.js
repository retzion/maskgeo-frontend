import axios from "axios"
import validate from "validator"

import { maskGeoApiUri } from "../../config"

const apiUri = maskGeoApiUri()

const universalHeaders = {
  "API-KEY": process.env["REACT_APP_MASKGEO_API_KEY"],
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
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
  return get(`${apiUri}/data`).catch(c => {
    console.error(c)
    alert(JSON.stringify(c))
  })
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
  createUser,
  decryptToken,
  fetchReviews,
  postReview,
  processToken,
  removeToken,
  requestMagicLoginLink,
  verifyToken,
}

import React from "react"
import ReactDOM from "react-dom"

import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { version } from "../package.json"

// global styles
import "semantic-ui-css/semantic.min.css"
import "./assets/css/index.css"

console.log(
  `Running ${process.env["REACT_APP_MG_ENV"]} version ${version} in ${process.env["NODE_ENV"]} environment`
)

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

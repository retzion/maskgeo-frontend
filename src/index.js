const React = require("react")
const ReactDOM = require("react-dom")
const App = require("./App")
const serviceWorker = require("./serviceWorker")
const { version } = require("../package.json")
require("./index.css")

console.log(`Running version ${version} in ${process.env["NODE_ENV"]} environment`)

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

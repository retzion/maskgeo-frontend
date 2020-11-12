const React = require("react")
const { BrowserRouter, Route, Switch } = require("react-router-dom")

// views
const Map = require("./Views/Map")
const NotFound = require("./Views/404")

module.exports = function App() {
  return (
    <BrowserRouter>
      <div id="top" className="app">
        <Switch>
          <Route path="/" component={Map} exact />
          <Route path="/token/:token" component={Map} exact />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

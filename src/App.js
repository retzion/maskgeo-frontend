import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"

// views
import Map from "./Views/Map"
import NotFound from "./Views/404"

export default function App() {
  return (
    <BrowserRouter>
      <div id="top" className="app">
        <Switch>
          <Route path="/" component={Map} exact />
          <Route path="/marker/:marker" component={Map} exact />
          <Route path="/search/:keyword/:locationZoom/selected/:selected" component={Map} exact />
          <Route path="/search/:keyword/:locationZoom" component={Map} exact />
          <Route path="/selected/:selected" component={Map} exact />
          <Route path="/token/:token" component={Map} exact />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export const websiteSettings = {
  friendlyName: "Mask Forecast",
  oneWordName: "MaskForecast",
}

export const appEnvironments = {
  local: 'local',
  production: 'production',
}

export const appEnvironment = appEnvironments[process.env['REACT_APP_MG_ENV'] || 'production']

export function maskGeoApiUri() {
  return ({
    production: 'https://maskgeo-backend.herokuapp.com',
    // production: 'http://api.maskforecast.com',
    local: 'http://localhost:3001',
    // local: 'http://127.0.0.1:3001',
  })[appEnvironment]
}

export const frontendUrl = process.env["REACT_APP_FRONTEND_URL"] || "http://localhost:3000"

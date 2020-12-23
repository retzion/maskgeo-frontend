export const websiteSettings = {
  friendlyName: "Mask Forecast",
  oneWordName: "MaskForecast",
}

export const appEnvironments = {
  development: "development",
  local: "local",
  production: "production",
}

export const appEnvironment =
  appEnvironments[
    process.env["REACT_APP_MG_ENV"] || process.env["NODE_ENV"] || "production"
  ]

const apiDomains = {
  development: "https://staging-maskgeo-backend.herokuapp.com",
  local: "http://localhost:3001",
  production: "https://api.maskforecast.com",
}
export const apiDomain = apiDomains[appEnvironment]

export function maskGeoApiUri() {
  return {
    development: "https://staging-maskgeo-backend.herokuapp.com",
    local: "http://localhost:3001",
    production: "https://api.maskforecast.com",
  }[appEnvironment]
}

export const cookieNames = {
  allowCookies: "allow-cookies",
  email: "email",
  jwtAccessToken: "mg-jwt",
  jwtRefreshToken: "mg-refresh-jwt",
  phone: "phone",
  position: "position",
}

export const frontendUrl =
  process.env["REACT_APP_PUBLIC_URL"] || "http://localhost:3000"

export const googleMapsApiKey = process.env["REACT_APP_GOOGLE_MAPS_API_KEY"]

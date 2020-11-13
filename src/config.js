const appEnvironments = {
  local: 'local',
  production: 'production',
}

const appEnvironment = appEnvironments[process.env['REACT_APP_MG_ENV'] || 'production']

export function maskGeoApiUri() {
  return ({
    production: 'https://maskgeo-backend.herokuapp.com',
    local: 'http://localhost:3001',
  })[appEnvironment]
}

export const frontendUrl = process.env["REACT_APP_FRONTEND_URL"] || "http://localhost:3000"

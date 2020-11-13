const appEnvironments = {
  local: 'local',
  production: 'production',
}

const appEnvironment = appEnvironments[process.env['REACT_APP_MG_ENV'] || 'production']

export function maskGeoApiUri() {
  return ({
    production: 'https://api.maskgeo.com',
    local: 'http://localhost:3001',
  })[appEnvironment]
}

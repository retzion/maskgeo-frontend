const appEnvironments = {
  local: 'local',
  production: 'production',
}

const appEnvironment = appEnvironments[process.env['REACT_APP_MG_ENV'] || 'production']

export function maskGeoApiUri() {
  return ({
    production: 'http://localhost:3001',
    local: 'http://localhost:3001',
  })[appEnvironment]
}

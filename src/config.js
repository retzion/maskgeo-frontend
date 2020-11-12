const appEnvironments = {
  local: 'local',
  production: 'production',
}

const appEnvironment = appEnvironments[process.env['REACT_APP_MG_ENV'] || 'production']

module.exports = {
  maskGeoApiUri: ({
    production: 'https://api.maskgeo.com',
    local: 'http://localhost:3001',
  })[appEnvironment],
}
const jsonFromLS = _key => {
  const data =
    window.localStorage.getItem(_key) != "undefined"
      ? window.localStorage.getItem(_key)
      : null
  return window.localStorage && data ? JSON.parse(data) : null
}

const lsFromJson = (_key, data) =>
  window.localStorage
    ? window.localStorage.setItem(_key, JSON.stringify(data))
    : null

export default class {
  static clearStorage(_key) {
    if (_key) window.localStorage.removeItem(_key)
    else for (const [key] of Object.entries(window.localStorage)) {
      window.localStorage.removeItem(key)
    }    
  }

  static getData(_key) {
    return jsonFromLS(_key)
  }

  static setData(_key, data) {
    lsFromJson(_key, data)
  }
}

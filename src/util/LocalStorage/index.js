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

module.exports = class {
  static async clearStorage(_key) {
    await this.setData(_key)
  }

  static getData(_key) {
    return jsonFromLS(_key)
  }

  static setData(_key, data) {
    lsFromJson(_key, data)
  }
}

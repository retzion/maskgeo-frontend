const phoneRegex = /^\+[1-9]\d{10,14}$/

module.exports = {
  validatePhone: phone => phoneRegex.test(phone),
}

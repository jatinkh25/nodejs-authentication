const User = require('../models/User')

// Handling errors
const handleErrors = (err) => {
  const errors = { email: '', password: '' }

  // Checking for duplicate email entry
  if (err.code === 11000) {
    errors.email = 'User already exists.'
    return errors
  }

  // Assigning feild errors in errors object
  Object.values(err.errors).forEach(({ properties }) => {
    errors[properties.path] = properties.message
  })

  return errors
}

const signup_get = (req, res) => {
  res.render('signup')
}

const login_get = (req, res) => {
  res.render('login')
}

const signup_post = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.create({ email, password })
    res.status(201).json(user)
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json(errors)
  }
}

const login_post = async (req, res) => {
  const { email, password } = req.body
}

module.exports = {
  signup_get,
  signup_post,
  login_get,
  login_post,
}

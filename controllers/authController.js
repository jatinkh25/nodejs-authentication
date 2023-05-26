const User = require('../models/User')
const Yup = require('yup')

const registerSchema = new Yup.ObjectSchema({
  fname: Yup.string()
    .required('First Name is required.')
    .min(1, 'First Name should be atleast 1 character long.'),
  lname: Yup.string()
    .required('Last Name is required.')
    .min(1, 'Last Name should be atleast 1 character long.'),
  email: Yup.string().email('Please enter a valid email.').required('Email is required.'),
  password: Yup.string().min(6, 'Password should be atleast six characters long.'),
})

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
  try {
    console.log('body', req)
    const response = await registerSchema.validate(req.body)
    console.log('res', response)
    const user = await User.create(req.body)
    res.status(201).json(user)
  } catch (err) {
    // const errors = handleErrors(err)
    console.log(err)
    res.status(400).json(err)
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

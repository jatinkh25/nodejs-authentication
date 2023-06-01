const User = require('../models/User')
const Yup = require('yup')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const { SECRET_KEY, SIGNUP_URL } = require('../utils/constants')

const registerSchema = new Yup.ObjectSchema({
  fname: Yup.string().required('First Name is required.'),
  lname: Yup.string().required('Last Name is required.'),
  email: Yup.string().matches(
    /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    'Please enter a valid email.'
  ),
  password: Yup.string()
    .required('Password is required.')
    .min(6, 'Password should be atleast six characters long.'),
})

const createToken = ({ _id, fname, lname, email }) => {
  const payload = {
    id: _id,
    fname,
    lname,
    email,
  }
  return jwt.sign(payload, SECRET_KEY, { expiresIn: 24 * 60 * 60 })
}

const signup_get = (req, res) => {
  res.render('signup', {
    signup_url: SIGNUP_URL,
  })
}

const login_get = (req, res) => {
  res.render('login')
}

const signup_post = async (req, res) => {
  const errorObj = {
    fname: '',
    lname: '',
    email: '',
    password: '',
  }

  try {
    await registerSchema.validate(req.body, {
      abortEarly: false,
    })

    const isEmailExists = await User.findOne({
      email: req.body.email,
    })

    if (isEmailExists) {
      errorObj.email = 'This email already exists.'
      res.status(400).json(errorObj)
    } else {
      const user = await User.create(req.body)
      const jwtToken = createToken(user)
      res.status(201).json({ access_token: jwtToken })
    }
  } catch (err) {
    console.log(err)
    err.inner.forEach((error) => {
      errorObj[error.path] = error.errors[0]
    })

    res.status(400).json(errorObj)
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

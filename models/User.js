const mongoose = require('mongoose')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minLength: [6, 'Password should have a minimum of six characters.'],
  },
})

const User = mongoose.model('user', userSchema)

module.exports = User

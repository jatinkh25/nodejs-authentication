const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [true, 'First Name is required.'],
    min: 1,
    max: 255,
  },
  lname: {
    type: String,
    required: [true, 'Last Name is required.'],
    min: 1,
    max: 255,
  },
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

// Fire a function before the user is saved to db
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

const User = mongoose.model('user', userSchema)

module.exports = User

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')

// User Schema
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

// Hash the password before saving the user to the database
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Login method to compare the provided email and password
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email })
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    }
    throw Error('Incorrect password')
  }
  throw Error('Incorrect email')
}

// User model
const User = mongoose.model('user', userSchema)

module.exports = User

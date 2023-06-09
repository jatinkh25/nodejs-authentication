const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const { requireAuth, checkUser } = require('./middlewares/authMiddleware')
require('dotenv').config()

const app = express()

// middleware
app.use(express.static('public'))
app.use(express.json())

// view engine
app.set('view engine', 'ejs')

// database connection
const dbURI = process.env.MONGODB_SERVER_URL || 'mongodb://localhost:27017/nodejs-auth'

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err))

// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'))
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'))

app.use(authRoutes)

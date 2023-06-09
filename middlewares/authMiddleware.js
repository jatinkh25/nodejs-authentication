const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../utils/constants')

const requireAuth = (req, res, next) => {
  const token = req.headers['authorization']

  if (token && token.split(' ')[1]) {
    // Checking if json web token exists & is verified
    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log(err.message)
        res.redirect('/login')
      } else {
        next()
      }
    })
  } else {
    res.redirect('/login')
  }
}

module.exports = { requireAuth }

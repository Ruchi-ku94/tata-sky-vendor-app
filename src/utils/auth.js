const path = require('path')
const jwt = require('jsonwebtoken')
require("dotenv").config({ path: path.resolve(__dirname, '../../.env') })
const { jwtExpiry } = require("./constants")

const verifyJWTToken = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodeToken) => {
        if(err || !decodeToken) {
          return reject(err)
        }
  
        resolve(decodeToken)
      })
    })
}


const createJWTToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: jwtExpiry})
}

module.exports = {
    verifyJWTToken,
    createJWTToken
}



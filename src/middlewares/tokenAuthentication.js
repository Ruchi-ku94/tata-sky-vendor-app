const { verifyJWTToken } = require('../utils/auth')

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization
  //console.log("========authHeader==================");
  //console.log(authHeader)

  verifyJWTToken(authHeader)
  .then((decodedToken) =>
  {
    req.id = decodedToken.id;
    console.log("=====token verification success============")
    next();
  }).catch((err) => {
    res.status(403)
      .json({message: "Invalid auth token provided."})
  })
}


module.exports = { authenticateToken }
const jwt = require("jsonwebtoken");
const userService = require("../service/user");
require('dotenv').config()

const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const user = await userService.getUserById(req.user.id);
    if(!user){
        return res.status(401).send("Invalid token");
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
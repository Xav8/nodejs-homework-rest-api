const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
require("dotenv").config();

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    console.log("token", token);

    if (!token) {
      return res.status(401).json({ message: "Not authorized middleware" });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verified);

    const userId = verified.userId;
    const user = await User.findById(userId);
    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized user" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Not authorized error" });
  }
};

module.exports = protectRoute;
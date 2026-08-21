const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    //check header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    //token do not exist
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized Token is missing",
      });
    }
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //find user and attach to request
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "interval server error un",
    });
  }
};

module.exports = protect;

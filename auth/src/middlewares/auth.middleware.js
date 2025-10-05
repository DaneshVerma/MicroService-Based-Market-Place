const jwt = require("jsonwebtoken");
const config = require("../config/environments");
const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;

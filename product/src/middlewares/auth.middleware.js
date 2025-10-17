const jwt = require("jsonwebtoken");
const config = require("../config/config");

function createAuthMiddleware(roles = ["user"]) {
  return (req, res, next) => {
    const token =
      req.cookies.token || req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}

module.exports = createAuthMiddleware;

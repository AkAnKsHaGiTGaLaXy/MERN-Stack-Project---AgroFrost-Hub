const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token" });
      }
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };

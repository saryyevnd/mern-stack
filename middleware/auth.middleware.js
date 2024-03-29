const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const [_, token] = req.headers.authorization.split(" "); // 'Bearer TOKEN'

    if (!token) {
      res.status(401).json({ message: "No authorization!" });
    }

    const decoded = jwt.verify(token, process.env.jwtSecret);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: "No authorization!" });
  }
};

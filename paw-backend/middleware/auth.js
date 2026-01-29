const jwt = require("jsonwebtoken");

const JWT_SECRET = "rahasia_jwt_praktikum";

const auth = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ada" });
  }

  try {
    const token = h.split(" ")[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Khusus admin" });
  }
  next();
};

module.exports = { auth, adminOnly, JWT_SECRET };

const jwt = require("jsonwebtoken");
const User = require("../model/user");

const Protect = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("Authorization Header:", authHeader);

  const token = authHeader?.split(" ")[1];
  console.log("Extracted Token:", token); // Debug log for token
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.userId).select("-password");
    console.log(req.user);
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

module.exports = Protect;
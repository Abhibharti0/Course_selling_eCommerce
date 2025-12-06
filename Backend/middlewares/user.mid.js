import jwt from "jsonwebtoken";
import config from "../config.js";

function usermiddleware(req, res, next) {
  let token;

  // 1️⃣ FIRST TRY — Authorization Bearer Token
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  
  if (!token) {
    return res.status(401).json({ errors: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_USER_PASSWORD);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ errors: "Invalid token" });
  }
}

export default usermiddleware;

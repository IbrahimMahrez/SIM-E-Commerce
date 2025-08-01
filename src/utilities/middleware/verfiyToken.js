
import jwt from 'jsonwebtoken'




export const verifyToken = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return next({ statusCode: 401, message: "Token is missing. Unauthorized" });
  }

  jwt.verify(token, "SIM7", (err, decoded) => {
    if (err) {
      return next({ statusCode: 401, message: "Invalid token. Unauthorized" });
    }

    req.decoded = decoded;
    next();
  });
};

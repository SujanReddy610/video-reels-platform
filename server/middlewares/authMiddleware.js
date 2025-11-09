// import jwt from "jsonwebtoken";
// import User from "../models/User.js"; // adjust path
// import Subscription from "../models/Subscription.js"; // optional

// const verifyToken = async (req, res, next) => {
//   let token;

//   try {
//     // Extract token from Authorization header
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer ")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Not authorized, token missing" });
//     }

//     if (!process.env.JWT_SECRET) {
//       return res
//         .status(500)
//         .json({ message: "Server error: JWT_SECRET not configured" });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log("Decoded token:", decoded); // dev only
//     } catch (err) {
//       if (err.name === "TokenExpiredError") {
//         return res.status(401).json({ message: "Token expired" });
//       } else if (err.name === "JsonWebTokenError") {
//         return res.status(401).json({ message: "Invalid token signature" });
//       } else {
//         return res.status(401).json({ message: "Token verification failed" });
//       }
//     }

//     // Fetch user from DB
//     const user = await User.findByPk(decoded.id, {
//       attributes: { exclude: ["password"] },
//     });

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     // Optional: fetch subscription info
//     // const subscription = await Subscription.findOne({ where: { userId: user.id } });

//     req.user = user;
//     // req.subscription = subscription;

//     next();
//   } catch (error) {
//     console.error("Auth middleware error:", error);
//     return res.status(401).json({ message: "Not authorized" });
//   }
// };

// export const protect = verifyToken;
// export default verifyToken;





// render to fetch token temp
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // adjust path
import Subscription from "../models/Subscription.js"; // optional

const verifyToken = async (req, res, next) => {
  let token;

  try {
    // Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized, token missing" });
    }

    if (!process.env.JWT_SECRET) {
      // CRITICAL: Fail safely if the secret key is not configured
      return res
        .status(500)
        .json({ message: "Server error: JWT_SECRET not configured" });
    }

    let decoded;
    try {
      // Verify token signature and expiration
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // dev only
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token signature" });
      } else {
        return res.status(401).json({ message: "Token verification failed" });
      }
    }

    // FIX: Using findOne with where clause instead of findByPk for robustness.
    // Ensure that 'id' is the primary key column in your User model.
    const user = await User.findOne({ 
        where: { id: decoded.id },
        attributes: { exclude: ["password"] } 
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Optional: fetch subscription info
    // const subscription = await Subscription.findOne({ where: { userId: user.id } });

    req.user = user;
    // req.subscription = subscription;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    // Use 500 for internal server errors not related to bad token
    return res.status(500).json({ message: "Internal server error during authorization" });
  }
};

export const protect = verifyToken;
export default verifyToken;

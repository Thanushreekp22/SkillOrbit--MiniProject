import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Verify Admin Token
export const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    
    // Check if user is admin
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Check Specific Permission
export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions) {
      return res.status(403).json({ message: "Access denied. No permissions found." });
    }

    if (!req.user.permissions[permission]) {
      return res.status(403).json({ 
        message: `Access denied. ${permission} permission required.` 
      });
    }

    next();
  };
};

// Check Super Admin Role
export const checkSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({ 
      message: "Access denied. Super admin privileges required." 
    });
  }
  next();
};

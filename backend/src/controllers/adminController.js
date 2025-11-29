import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Admin Login with enhanced security
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if account is locked
    if (admin.isLocked) {
      const lockTimeRemaining = Math.ceil((admin.lockUntil - Date.now()) / 60000);
      return res.status(423).json({ 
        message: `Account locked due to multiple failed login attempts. Try again in ${lockTimeRemaining} minutes.`,
        lockedUntil: admin.lockUntil
      });
    }

    // Check if account is active
    if (!admin.isActive) {
      await admin.logActivity('FAILED_LOGIN_ATTEMPT', 'Account is inactive', ipAddress);
      return res.status(403).json({ message: "Account is disabled. Contact super admin." });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      await admin.incLoginAttempts();
      await admin.logActivity('FAILED_LOGIN_ATTEMPT', 'Invalid password', ipAddress);
      
      const attemptsLeft = 5 - admin.loginAttempts - 1;
      if (attemptsLeft > 0) {
        return res.status(401).json({ 
          message: `Invalid credentials. ${attemptsLeft} attempt(s) remaining.` 
        });
      } else {
        return res.status(401).json({ 
          message: "Invalid credentials. Account has been locked for 2 hours." 
        });
      }
    }

    // Reset login attempts on successful login
    if (admin.loginAttempts > 0) {
      await admin.resetLoginAttempts();
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Log successful login
    await admin.logActivity('LOGIN', 'Successful login', ipAddress);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        email: admin.email,
        role: admin.role,
        isAdmin: true,
        permissions: admin.permissions
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Create Admin (Super Admin only)
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role, permissions } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const creatorId = req.user.id;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'admin',
      permissions: permissions || {
        manageQuestions: true,
        manageUsers: false,
        viewAnalytics: true,
        manageRoles: false,
        manageSkills: false,
        exportData: false
      }
    });

    // Log activity for creator
    const creator = await Admin.findById(creatorId);
    if (creator) {
      await creator.logActivity('CREATE_ADMIN', 
        `Created admin account for ${email} with role ${role || 'admin'}`, 
        ipAddress
      );
    }

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ message: "Failed to create admin", error: error.message });
  }
};

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;

    const admin = await Admin.findById(adminId).select('-password');
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ admin });
  } catch (error) {
    console.error("Get admin profile error:", error);
    res.status(500).json({ message: "Failed to get profile", error: error.message });
  }
};

// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { name, email } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Validation
    if (!name && !email) {
      return res.status(400).json({ message: "At least one field (name or email) is required" });
    }

    // Check email uniqueness if email is being changed
    if (email) {
      const existingAdmin = await Admin.findOne({ email, _id: { $ne: adminId } });
      if (existingAdmin) {
        return res.status(400).json({ message: "Email already in use by another admin" });
      }
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Track changes for activity log
    const changes = [];
    if (name && name !== admin.name) changes.push(`name from '${admin.name}' to '${name}'`);
    if (email && email !== admin.email) changes.push(`email from '${admin.email}' to '${email}'`);

    // Update fields
    if (name) admin.name = name;
    if (email) admin.email = email;
    await admin.save();

    // Log activity
    if (changes.length > 0) {
      await admin.logActivity('UPDATE_PROFILE', 
        `Updated ${changes.join(', ')}`, 
        ipAddress
      );
    }

    const updatedAdmin = admin.toObject();
    delete updatedAdmin.password;

    res.json({
      message: "Profile updated successfully",
      admin: updatedAdmin
    });
  } catch (error) {
    console.error("Update admin profile error:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

// Change Admin Password
export const changeAdminPassword = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordValid) {
      // Log failed attempt
      await admin.logActivity('PASSWORD_CHANGE_FAILED', 
        'Failed password change attempt - incorrect current password', 
        ipAddress
      );
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash and update new password
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    // Log successful password change
    await admin.logActivity('PASSWORD_CHANGED', 
      'Password changed successfully', 
      ipAddress
    );

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Failed to change password", error: error.message });
  }
};

// Get All Admins (Super Admin only)
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });

    res.json({
      total: admins.length,
      admins
    });
  } catch (error) {
    console.error("Get all admins error:", error);
    res.status(500).json({ message: "Failed to get admins", error: error.message });
  }
};

// Toggle Admin Active Status (Super Admin only)
export const toggleAdminStatus = async (req, res) => {
  try {
    const { adminId } = req.params;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const modifierId = req.user.id;

    // Prevent self-deactivation
    if (adminId === modifierId) {
      return res.status(400).json({ message: "You cannot deactivate your own account" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const previousStatus = admin.isActive;
    admin.isActive = !admin.isActive;
    
    // Reset login attempts if activating
    if (admin.isActive && admin.loginAttempts > 0) {
      await admin.resetLoginAttempts();
    }
    
    await admin.save();

    // Log activity for target admin
    await admin.logActivity(
      admin.isActive ? 'ACCOUNT_ACTIVATED' : 'ACCOUNT_DEACTIVATED',
      `Account ${admin.isActive ? 'activated' : 'deactivated'} by super admin`,
      ipAddress
    );

    // Log activity for modifier
    const modifier = await Admin.findById(modifierId);
    if (modifier) {
      await modifier.logActivity(
        admin.isActive ? 'ADMIN_ACTIVATED' : 'ADMIN_DEACTIVATED',
        `${admin.isActive ? 'Activated' : 'Deactivated'} admin account: ${admin.email}`,
        ipAddress
      );
    }

    res.json({
      message: `Admin ${admin.isActive ? 'activated' : 'deactivated'} successfully`,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    console.error("Toggle admin status error:", error);
    res.status(500).json({ message: "Failed to toggle admin status", error: error.message });
  }
};

// Get Admin Activity Log
export const getAdminActivity = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { limit = 50, action } = req.query;

    const admin = await Admin.findById(adminId).select('activityLog name email role');
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let activityLog = admin.activityLog || [];

    // Filter by action type if provided
    if (action) {
      activityLog = activityLog.filter(log => log.action === action);
    }

    // Sort by most recent first and limit results
    activityLog = activityLog
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));

    res.json({
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      totalActivities: activityLog.length,
      activities: activityLog
    });
  } catch (error) {
    console.error("Get admin activity error:", error);
    res.status(500).json({ message: "Failed to get activity log", error: error.message });
  }
};

// Get Own Activity Log
export const getMyActivity = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { limit = 50, action } = req.query;

    const admin = await Admin.findById(adminId).select('activityLog');
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let activityLog = admin.activityLog || [];

    // Filter by action type if provided
    if (action) {
      activityLog = activityLog.filter(log => log.action === action);
    }

    // Sort by most recent first and limit results
    activityLog = activityLog
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));

    res.json({
      totalActivities: activityLog.length,
      activities: activityLog
    });
  } catch (error) {
    console.error("Get my activity error:", error);
    res.status(500).json({ message: "Failed to get activity log", error: error.message });
  }
};

// Get Admin Statistics
export const getAdminStatistics = async (req, res) => {
  try {
    const totalAdmins = await Admin.countDocuments();
    const activeAdmins = await Admin.countDocuments({ isActive: true });
    const lockedAdmins = await Admin.countDocuments({ 
      lockUntil: { $exists: true, $gt: new Date() } 
    });

    // Count by role
    const roleDistribution = await Admin.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent activity (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogins = await Admin.countDocuments({
      lastLogin: { $gte: last24Hours }
    });

    res.json({
      totalAdmins,
      activeAdmins,
      inactiveAdmins: totalAdmins - activeAdmins,
      lockedAdmins,
      roleDistribution,
      recentLogins
    });
  } catch (error) {
    console.error("Get admin statistics error:", error);
    res.status(500).json({ message: "Failed to get statistics", error: error.message });
  }
};

// Unlock Admin Account (Super Admin only)
export const unlockAdminAccount = async (req, res) => {
  try {
    const { adminId } = req.params;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const modifierId = req.user.id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!admin.isLocked) {
      return res.status(400).json({ message: "Admin account is not locked" });
    }

    await admin.resetLoginAttempts();

    // Log activity for unlocked admin
    await admin.logActivity('ACCOUNT_UNLOCKED', 
      'Account unlocked by super admin', 
      ipAddress
    );

    // Log activity for modifier
    const modifier = await Admin.findById(modifierId);
    if (modifier) {
      await modifier.logActivity('ADMIN_UNLOCKED', 
        `Unlocked admin account: ${admin.email}`, 
        ipAddress
      );
    }

    res.json({
      message: "Admin account unlocked successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    console.error("Unlock admin account error:", error);
    res.status(500).json({ message: "Failed to unlock account", error: error.message });
  }
};

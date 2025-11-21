import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if super admin already exists
    const existingAdmin = await Admin.findOne({ role: 'super_admin' });
    if (existingAdmin) {
      console.log("⚠️  Super admin already exists!");
      console.log("Email:", existingAdmin.email);
      process.exit(0);
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash("admin@123", 10);
    
    const superAdmin = await Admin.create({
      name: "Super Admin",
      email: "admin@skillorbit.com",
      password: hashedPassword,
      role: "super_admin",
      permissions: {
        manageQuestions: true,
        manageUsers: true,
        viewAnalytics: true,
        manageRoles: true
      },
      isActive: true
    });

    console.log("✅ Super Admin created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:", superAdmin.email);
    console.log("🔑 Password: admin@123");
    console.log("👑 Role:", superAdmin.role);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating super admin:", error);
    process.exit(1);
  }
};

createSuperAdmin();

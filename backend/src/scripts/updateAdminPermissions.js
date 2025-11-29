import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const updateAdminPermissions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the admin account
    const admin = await Admin.findOne({ email: 'admin@skillorbit.com' });
    
    if (!admin) {
      console.log('❌ Admin not found');
      process.exit(1);
    }

    console.log('\n📋 Current Admin Data:');
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Permissions:', admin.permissions);
    console.log('IsActive:', admin.isActive);

    // Update permissions to ensure manageQuestions is true
    admin.permissions = {
      manageQuestions: true,
      manageUsers: false,
      viewAnalytics: true,
      manageRoles: false,
      manageSkills: false,
      exportData: true
    };

    // Ensure admin is active
    admin.isActive = true;

    await admin.save();

    console.log('\n✅ Admin permissions updated successfully!');
    console.log('Updated Permissions:', admin.permissions);

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateAdminPermissions();

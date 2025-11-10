import mongoose from "mongoose";
import dotenv from "dotenv";
import { Analysis } from "../models/index.js";

dotenv.config();

const clearAnalysis = async () => {
  try {
    console.log("🧹 Clearing old Analysis data...\n");
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");
    
    // Clear all analysis records
    const result = await Analysis.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} old analysis records\n`);
    
    console.log("✅ Analysis collection cleared successfully!\n");
    console.log("📝 You can now run analysis with the new schema.\n");
    
  } catch (error) {
    console.error("❌ Error clearing analysis:", error);
  } finally {
    await mongoose.connection.close();
    console.log("📝 Database connection closed");
    process.exit(0);
  }
};

clearAnalysis();

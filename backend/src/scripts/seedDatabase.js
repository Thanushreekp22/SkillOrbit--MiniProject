import mongoose from "mongoose";
import dotenv from "dotenv";
import { QuestionBank } from "../models/index.js";
import { seedQuestions } from "../utils/sampleQuestions.js";

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    
    // Seed questions
    await seedQuestions(QuestionBank);
    
    console.log("🎉 Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log("📝 Database connection closed");
    process.exit(0);
  }
};

// Run the seeding
seedDatabase();

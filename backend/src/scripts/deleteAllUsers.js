import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import models
import User from '../models/User.js';
import Assessment from '../models/Assessment.js';
import Progress from '../models/Progress.js';
import LearningPath from '../models/LearningPath.js';
import AILearningPath from '../models/AILearningPath.js';
import Analysis from '../models/Analysis.js';
import Report from '../models/Report.js';
import UserQuestionnaire from '../models/UserQuestionnaire.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Delete all users and their data
const deleteAllUsers = async () => {
  try {
    console.log('\n🗑️  Starting deletion of all users and their data...\n');

    // Delete all user-related data
    const userQuestionnairesDeleted = await UserQuestionnaire.deleteMany({});
    console.log(`✅ Deleted ${userQuestionnairesDeleted.deletedCount} user questionnaires`);

    const assessmentsDeleted = await Assessment.deleteMany({});
    console.log(`✅ Deleted ${assessmentsDeleted.deletedCount} assessments`);

    const progressDeleted = await Progress.deleteMany({});
    console.log(`✅ Deleted ${progressDeleted.deletedCount} progress records`);

    const learningPathsDeleted = await LearningPath.deleteMany({});
    console.log(`✅ Deleted ${learningPathsDeleted.deletedCount} learning paths`);

    const aiLearningPathsDeleted = await AILearningPath.deleteMany({});
    console.log(`✅ Deleted ${aiLearningPathsDeleted.deletedCount} AI learning paths`);

    const analysisDeleted = await Analysis.deleteMany({});
    console.log(`✅ Deleted ${analysisDeleted.deletedCount} analysis records`);

    const reportsDeleted = await Report.deleteMany({});
    console.log(`✅ Deleted ${reportsDeleted.deletedCount} reports`);

    // Finally, delete all users
    const usersDeleted = await User.deleteMany({});
    console.log(`✅ Deleted ${usersDeleted.deletedCount} users`);

    console.log('\n✨ All users and their activity data have been successfully deleted!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${usersDeleted.deletedCount}`);
    console.log(`   - Questionnaires: ${userQuestionnairesDeleted.deletedCount}`);
    console.log(`   - Assessments: ${assessmentsDeleted.deletedCount}`);
    console.log(`   - Progress: ${progressDeleted.deletedCount}`);
    console.log(`   - Learning Paths: ${learningPathsDeleted.deletedCount}`);
    console.log(`   - AI Learning Paths: ${aiLearningPathsDeleted.deletedCount}`);
    console.log(`   - Analysis: ${analysisDeleted.deletedCount}`);
    console.log(`   - Reports: ${reportsDeleted.deletedCount}`);
    console.log(`   - Total Records Deleted: ${
      usersDeleted.deletedCount +
      userQuestionnairesDeleted.deletedCount +
      assessmentsDeleted.deletedCount +
      progressDeleted.deletedCount +
      learningPathsDeleted.deletedCount +
      aiLearningPathsDeleted.deletedCount +
      analysisDeleted.deletedCount +
      reportsDeleted.deletedCount
    }`);

  } catch (error) {
    console.error('❌ Error deleting users:', error.message);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await deleteAllUsers();
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
};

// Run the script
main();

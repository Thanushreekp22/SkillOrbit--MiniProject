import mongoose from "mongoose";
import dotenv from "dotenv";
import { QuestionBank } from "../models/index.js";
import { fullStackDeveloperQuestions } from "../data/fullStackDeveloperQuestions.js";
import { dataScientistQuestions } from "../data/dataScientistQuestions.js";
import { cloudEngineerQuestions } from "../data/cloudEngineerQuestions.js";
import { mobileDeveloperQuestions } from "../data/mobileDeveloperQuestions.js";
import { aiMlEngineerQuestions } from "../data/aiMlEngineerQuestions.js";
import { cybersecuritySpecialistQuestions } from "../data/cybersecuritySpecialistQuestions.js";
import { devOpsEngineerQuestions } from "../data/devOpsEngineerQuestions.js";
import { dataAnalystQuestions } from "../data/dataAnalystQuestions.js";

dotenv.config();

const seedAllQuestions = async () => {
  try {
    console.log("🌱 Starting question seeding for all 8 job roles...\n");
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");
    
    // Clear existing questions
    await QuestionBank.deleteMany({});
    console.log("🗑️  Cleared existing questions\n");
    
    // Combine all questions
    const allQuestions = [
      ...fullStackDeveloperQuestions,
      ...dataScientistQuestions,
      ...cloudEngineerQuestions,
      ...mobileDeveloperQuestions,
      ...aiMlEngineerQuestions,
      ...cybersecuritySpecialistQuestions,
      ...devOpsEngineerQuestions,
      ...dataAnalystQuestions
    ];
    
    // Filter out empty arrays
    const validQuestions = allQuestions.filter(q => q && q.skillName);
    
    if (validQuestions.length === 0) {
      console.log("⚠️  No questions found. Please add questions to the data files.");
      return;
    }
    
    // Insert all questions
    await QuestionBank.insertMany(validQuestions);
    console.log(`✅ Inserted ${validQuestions.length} questions\n`);
    
    // Display summary by role
    console.log("📊 Question Bank Summary:\n");
    console.log("═".repeat(60));
    
    const roles = {
      "Full Stack Developer": ["React", "Node.js", "MongoDB", "TypeScript", "JavaScript"],
      "Data Scientist": ["Python", "SQL", "R", "Machine Learning", "Statistics"],
      "Cloud Engineer": ["AWS", "Docker", "Kubernetes", "Terraform", "Linux"],
      "Mobile Developer": ["React Native", "Flutter", "Swift", "Kotlin", "Mobile UI/UX"],
      "AI/ML Engineer": ["Python", "TensorFlow", "PyTorch", "Deep Learning", "NLP"],
      "Cybersecurity Specialist": ["Network Security", "Ethical Hacking", "CISSP", "Penetration Testing", "Cryptography"],
      "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "Jenkins", "Ansible"],
      "Data Analyst": ["SQL", "Tableau", "Power BI", "Excel", "Data Visualization"]
    };
    
    for (const [role, skills] of Object.entries(roles)) {
      const roleQuestionCount = await QuestionBank.countDocuments({ 
        skillName: { $in: skills } 
      });
      console.log(`📌 ${role}: ${roleQuestionCount} questions`);
      
      // Show breakdown by skill
      for (const skill of skills) {
        const skillCount = await QuestionBank.countDocuments({ skillName: skill });
        if (skillCount > 0) {
          const basicCount = await QuestionBank.countDocuments({ skillName: skill, difficulty: 'basic' });
          const intermediateCount = await QuestionBank.countDocuments({ skillName: skill, difficulty: 'intermediate' });
          const advancedCount = await QuestionBank.countDocuments({ skillName: skill, difficulty: 'advanced' });
          console.log(`   └─ ${skill}: ${skillCount} (Basic: ${basicCount}, Intermediate: ${intermediateCount}, Advanced: ${advancedCount})`);
        }
      }
      console.log();
    }
    
    console.log("═".repeat(60));
    console.log(`\n✅ Total Questions: ${validQuestions.length}`);
    console.log(`🎯 Target: 540 questions (75 per role × 8 roles)`);
    console.log(`📝 Remaining: ${540 - validQuestions.length} questions to add\n`);
    
    console.log("🎉 Question seeding completed successfully!\n");
    
  } catch (error) {
    console.error("❌ Error seeding questions:", error);
  } finally {
    await mongoose.connection.close();
    console.log("📝 Database connection closed");
    process.exit(0);
  }
};

seedAllQuestions();

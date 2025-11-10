import mongoose from "mongoose";
import dotenv from "dotenv";
import { Role, RoleSkill } from "../models/index.js";

dotenv.config();

// 8 Job Roles with their required skills and proficiency levels
const roleSkillMappings = [
  {
    roleName: "Full Stack Developer",
    roleDescription: "Develops both frontend and backend of web applications",
    skills: [
      { skillName: "React", requiredProficiency: 80, priority: "high", type: "technical" },
      { skillName: "Node.js", requiredProficiency: 80, priority: "high", type: "technical" },
      { skillName: "MongoDB", requiredProficiency: 70, priority: "high", type: "technical" },
      { skillName: "TypeScript", requiredProficiency: 75, priority: "medium", type: "technical" },
      { skillName: "JavaScript", requiredProficiency: 85, priority: "high", type: "technical" }
    ]
  },
  {
    roleName: "Data Scientist",
    roleDescription: "Analyzes complex data to help companies make decisions",
    skills: [
      { skillName: "Python", requiredProficiency: 85, priority: "high", type: "technical" },
      { skillName: "SQL", requiredProficiency: 80, priority: "high", type: "technical" },
      { skillName: "R", requiredProficiency: 70, priority: "medium", type: "technical" },
      { skillName: "Machine Learning", requiredProficiency: 80, priority: "high", type: "technical" },
      { skillName: "Statistics", requiredProficiency: 85, priority: "high", type: "technical" }
    ]
  },
  {
    roleName: "Cloud Engineer",
    roleDescription: "Designs and manages cloud infrastructure",
    skills: [
      { skillName: "AWS", requiredProficiency: 85, priority: "high", type: "technical" },
      { skillName: "Docker", requiredProficiency: 80, priority: "high", type: "technical" },
      { skillName: "Kubernetes", requiredProficiency: 80, priority: "high", type: "technical" },
      { skillName: "Terraform", requiredProficiency: 75, priority: "medium", type: "technical" },
      { skillName: "Linux", requiredProficiency: 80, priority: "high", type: "technical" }
    ]
  },
  {
    roleName: "Mobile Developer",
    roleDescription: "Creates applications for mobile devices",
    skills: [
      { skillName: "React Native", requiredProficiency: 80, priority: "high", type: "technical" },
      { skillName: "Flutter", requiredProficiency: 75, priority: "medium", type: "technical" },
      { skillName: "Swift", requiredProficiency: 75, priority: "medium", type: "technical" },
      { skillName: "Kotlin", requiredProficiency: 75, priority: "medium", type: "technical" },
      { skillName: "Mobile UI/UX", requiredProficiency: 70, priority: "medium", type: "technical" }
    ]
  },
  {
    roleName: "AI/ML Engineer",
    roleDescription: "Develops artificial intelligence and machine learning systems",
    skills: [
      { skillName: "Python", requiredProficiency: 90, priority: "high", type: "technical" },
      { skillName: "TensorFlow", requiredProficiency: 85, priority: "high", type: "technical" },
      { skillName: "PyTorch", requiredProficiency: 85, priority: "high", type: "technical" },
      { skillName: "Deep Learning", requiredProficiency: 85, priority: "high", type: "technical" },
      { skillName: "NLP", requiredProficiency: 80, priority: "medium", type: "technical" }
    ]
  },
  {
    roleName: "Cybersecurity Specialist",
    roleDescription: "Protects systems and networks from security threats",
    skills: [
      { skillName: "Network Security", requiredProficiency: 85, priority: "high", type: "technical" },
      { skillName: "Ethical Hacking", requiredProficiency: 80, priority: "high", type: "technical" },
      { skillName: "CISSP", requiredProficiency: 75, priority: "medium", type: "technical" },
      { skillName: "Penetration Testing", requiredProficiency: 85, priority: "high", type: "technical" },
      { skillName: "Cryptography", requiredProficiency: 80, priority: "high", type: "technical" }
    ]
  },
  {
    roleName: "DevOps Engineer",
    roleDescription: "Bridges development and operations teams",
    skills: [
      { skillName: "Docker", requiredProficiency: 85, priority: "high", type: "technical" },
      { skillName: "Kubernetes", requiredProficiency: 85, priority: "high", type: "technical" },
      { skillName: "CI/CD", requiredProficiency: 80, priority: "high", type: "technical" },
      { skillName: "Jenkins", requiredProficiency: 75, priority: "medium", type: "technical" },
      { skillName: "Ansible", requiredProficiency: 75, priority: "medium", type: "technical" }
    ]
  },
  {
    roleName: "Data Analyst",
    roleDescription: "Interprets data to help businesses make informed decisions",
    skills: [
      { skillName: "SQL", requiredProficiency: 85, priority: "high", type: "technical" },
      { skillName: "Tableau", requiredProficiency: 80, priority: "high", type: "technical" },
      { skillName: "Power BI", requiredProficiency: 80, priority: "high", type: "technical" },
      { skillName: "Excel", requiredProficiency: 85, priority: "high", type: "technical" },
      { skillName: "Data Visualization", requiredProficiency: 75, priority: "medium", type: "technical" }
    ]
  }
];

const seedRoleSkills = async () => {
  try {
    console.log("🌱 Starting role-skill mapping seed...\n");
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");
    
    // Clear existing data
    await Role.deleteMany({});
    await RoleSkill.deleteMany({});
    console.log("🗑️  Cleared existing roles and role-skills\n");
    
    let totalSkillsAdded = 0;
    
    // Insert roles and their skill requirements
    for (const roleData of roleSkillMappings) {
      // Create role
      const role = await Role.create({
        title: roleData.roleName,
        description: roleData.roleDescription
      });
      
      console.log(`📌 Created role: ${roleData.roleName}`);
      
      // Create role-skill mappings
      for (const skill of roleData.skills) {
        await RoleSkill.create({
          roleId: role._id,
          roleName: roleData.roleName,
          skillName: skill.skillName,
          requiredProficiency: skill.requiredProficiency,
          priority: skill.priority,
          type: skill.type,
          weight: skill.priority === 'high' ? 1.5 : 1.0
        });
        totalSkillsAdded++;
      }
      
      console.log(`   └─ Added ${roleData.skills.length} skill requirements\n`);
    }
    
    console.log("═".repeat(60));
    console.log(`\n✅ Successfully seeded:`);
    console.log(`   📋 ${roleSkillMappings.length} roles`);
    console.log(`   🎯 ${totalSkillsAdded} skill requirements`);
    console.log(`   📊 Average ${Math.round(totalSkillsAdded / roleSkillMappings.length)} skills per role\n`);
    
    // Display summary
    console.log("📊 Role-Skill Summary:\n");
    console.log("═".repeat(60));
    
    for (const roleData of roleSkillMappings) {
      const skillCount = await RoleSkill.countDocuments({ roleName: roleData.roleName });
      console.log(`\n📌 ${roleData.roleName}:`);
      console.log(`   Skills: ${skillCount}`);
      
      const roleSkills = await RoleSkill.find({ roleName: roleData.roleName });
      roleSkills.forEach(rs => {
        console.log(`   └─ ${rs.skillName}: ${rs.requiredProficiency}% (${rs.priority} priority)`);
      });
    }
    
    console.log("\n" + "═".repeat(60));
    console.log("\n🎉 Role-skill seeding completed successfully!\n");
    
  } catch (error) {
    console.error("❌ Error seeding role-skills:", error);
  } finally {
    await mongoose.connection.close();
    console.log("📝 Database connection closed");
    process.exit(0);
  }
};

seedRoleSkills();

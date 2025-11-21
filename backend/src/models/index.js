// MongoDB Models - No need for explicit associations like Sequelize
// Mongoose uses references and population for relationships

import User from "./User.js";
import Skill from "./skillModel.js";
import Role from "./Role.js";
import RoleSkill from "./RoleSkill.js";
import Analysis from "./Analysis.js";
import LearningPath from "./LearningPath.js";
import Progress from "./Progress.js";
import Report from "./Report.js";
import QuestionBank from "./QuestionBank.js";
import UserQuestionnaire from "./UserQuestionnaire.js";
import Assessment from "./Assessment.js";
import Admin from "./Admin.js";

// Export all models
export { 
  User, 
  Skill, 
  Role, 
  RoleSkill,
  Analysis, 
  LearningPath, 
  Progress, 
  Report,
  QuestionBank,
  UserQuestionnaire,
  Assessment,
  Admin
};

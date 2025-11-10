import { Analysis, Skill, Role, RoleSkill } from "../models/index.js";
import mongoose from "mongoose";

// Perform skill gap analysis for a user
export const analyzeSkillGap = async (req, res) => {
  try {
    const { userId, targetRole } = req.body;

    // Get user's current skills
    const userSkills = await Skill.find({ userId });
    
    // Get required skills for the target role
    const roleSkills = await RoleSkill.find({ 
      roleName: new RegExp(targetRole, 'i') 
    });

    if (roleSkills.length === 0) {
      return res.status(404).json({ 
        message: "No skill requirements found for this role" 
      });
    }

    // Create a map of user's skills
    const userSkillMap = {};
    userSkills.forEach(skill => {
      userSkillMap[skill.name.toLowerCase()] = skill.proficiency;
    });

    // Calculate gaps
    const gaps = [];
    let totalGap = 0;
    let skillsAnalyzed = 0;
    let totalGapPercentage = 0;

    for (const roleSkill of roleSkills) {
      const skillName = roleSkill.skillName;
      const requiredProficiency = roleSkill.requiredProficiency || 70;
      const currentProficiency = userSkillMap[skillName.toLowerCase()] || 0;
      const gapValue = Math.max(0, requiredProficiency - currentProficiency);
      
      // Calculate gap percentage (how much of the required skill is missing)
      const gapPercentage = requiredProficiency > 0 
        ? Math.round((gapValue / requiredProficiency) * 100) 
        : 0;
      
      // Calculate completion percentage (how much is achieved)
      const completionPercentage = requiredProficiency > 0
        ? Math.round((currentProficiency / requiredProficiency) * 100)
        : 0;

      gaps.push({
        skillName,
        currentProficiency,
        requiredProficiency,
        gapValue,
        gapPercentage,
        completionPercentage: Math.min(completionPercentage, 100),
        priority: roleSkill.priority || 'medium',
        status: gapValue === 0 ? 'met' : gapValue <= 20 ? 'close' : 'gap'
      });

      totalGap += gapValue;
      totalGapPercentage += gapPercentage;
      skillsAnalyzed++;
    }

    // Sort by gap value (highest first)
    gaps.sort((a, b) => b.gapValue - a.gapValue);

    // Generate recommendations
    const recommendations = gaps
      .filter(gap => gap.gapValue > 0)
      .slice(0, 5)
      .map(gap => {
        let recommendation = '';
        if (gap.gapValue > 50) {
          recommendation = `Start with fundamentals of ${gap.skillName}. Consider taking a comprehensive course.`;
        } else if (gap.gapValue > 20) {
          recommendation = `Improve your ${gap.skillName} skills through practice projects and intermediate tutorials.`;
        } else {
          recommendation = `You're close! Focus on advanced concepts in ${gap.skillName}.`;
        }
        return {
          skillName: gap.skillName,
          recommendation,
          priority: gap.priority
        };
      });

    // Calculate readiness score
    const readinessScore = Math.max(0, 100 - (totalGap / skillsAnalyzed));
    
    // Calculate average gap percentage
    const avgGapPercentage = skillsAnalyzed > 0 
      ? Math.round(totalGapPercentage / skillsAnalyzed) 
      : 0;
    
    // Calculate overall completion percentage
    const overallCompletion = 100 - avgGapPercentage;

    // Save analysis
    const analysis = await Analysis.create({
      userId,
      targetRole,
      currentSkills: userSkills.map(s => ({
        name: s.name,
        proficiency: s.proficiency
      })),
      requiredSkills: roleSkills.map(rs => ({
        name: rs.skillName,
        requiredProficiency: rs.requiredProficiency || 70
      })),
      gaps,
      recommendations,
      readinessScore: Math.round(readinessScore),
      analyzedAt: new Date()
    });

    res.json({
      message: "Skill gap analysis completed",
      analysis: {
        _id: analysis._id,
        targetRole,
        readinessScore: Math.round(readinessScore),
        totalGaps: gaps.filter(g => g.gapValue > 0).length,
        skillsAnalyzed,
        avgGapPercentage,
        overallCompletion: Math.max(0, overallCompletion),
        gaps,
        recommendations
      }
    });

  } catch (error) {
    console.error("Error analyzing skill gap:", error);
    res.status(500).json({ 
      message: "Error analyzing skill gap", 
      error: error.message 
    });
  }
};

// Get user's analysis history
export const getUserAnalyses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const analyses = await Analysis.find({ userId })
      .sort({ analyzedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-gaps -currentSkills -requiredSkills'); // Exclude detailed data for list view

    const total = await Analysis.countDocuments({ userId });

    res.json({
      analyses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Error fetching analyses:", error);
    res.status(500).json({ 
      message: "Error fetching analyses", 
      error: error.message 
    });
  }
};

// Get detailed analysis by ID
export const getAnalysisById = async (req, res) => {
  try {
    const { analysisId } = req.params;
    const userId = req.user.id;

    const analysis = await Analysis.findById(analysisId);

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    if (analysis.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.json({ analysis });
  } catch (error) {
    console.error("Error fetching analysis:", error);
    res.status(500).json({ 
      message: "Error fetching analysis", 
      error: error.message 
    });
  }
};

// Get available roles for analysis
export const getAvailableRoles = async (req, res) => {
  try {
    const roles = await Role.find().select('title description');
    
    // Also get unique role names from RoleSkill
    const roleSkillRoles = await RoleSkill.distinct('roleName');
    
    // Combine and deduplicate
    const allRoles = [
      ...roles.map(r => ({ name: r.title, description: r.description })),
      ...roleSkillRoles.map(r => ({ name: r, description: '' }))
    ];

    // Remove duplicates
    const uniqueRoles = Array.from(
      new Map(allRoles.map(r => [r.name.toLowerCase(), r])).values()
    );

    res.json({ roles: uniqueRoles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ 
      message: "Error fetching roles", 
      error: error.message 
    });
  }
};

// Get skill recommendations based on career path
export const getSkillRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { careerPath } = req.query;

    // Get user's current skills
    const userSkills = await Skill.find({ userId });
    const userSkillNames = userSkills.map(s => s.name.toLowerCase());

    // Get trending skills in the career path
    const trendingSkills = {
      'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker', 'AWS'],
      'Data Scientist': ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Pandas', 'Jupyter'],
      'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform', 'Linux'],
      'Mobile Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'REST APIs'],
      'Cloud Architect': ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'Microservices']
    };

    const recommendedSkills = trendingSkills[careerPath] || [];
    
    // Filter out skills user already has
    const skillsToLearn = recommendedSkills.filter(
      skill => !userSkillNames.includes(skill.toLowerCase())
    );

    res.json({
      careerPath,
      currentSkills: userSkills.length,
      recommendedSkills: skillsToLearn.map(skill => ({
        name: skill,
        priority: 'high',
        estimatedLearningTime: '2-3 months',
        resources: [
          { type: 'course', name: `${skill} Complete Guide`, platform: 'Udemy' },
          { type: 'documentation', name: `Official ${skill} Docs`, platform: 'Official' },
          { type: 'practice', name: `${skill} Projects`, platform: 'GitHub' }
        ]
      }))
    });
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ 
      message: "Error getting recommendations", 
      error: error.message 
    });
  }
};

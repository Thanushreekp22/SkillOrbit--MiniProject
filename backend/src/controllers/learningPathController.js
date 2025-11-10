import LearningPath from "../models/LearningPath.js";
import Skill from "../models/skillModel.js";
import Assessment from "../models/Assessment.js";
import AILearningPath from "../models/AILearningPath.js";
import grokAI from "../services/grokAI.js";

export const generateLearningPath = async (req, res) => {
  try {
    const { userId, skills } = req.body;

    if (!userId || !Array.isArray(skills))
      return res.status(400).json({ message: "userId and skills[] are required" });

    const learningPaths = [];

    for (const skillId of skills) {
      const skill = await Skill.findByPk(skillId);
      if (!skill) continue;

      // mock recommended resources — can link to APIs later
      const resources = [
        `https://www.w3schools.com/${skill.name.toLowerCase()}`,
        `https://www.geeksforgeeks.org/${skill.name.toLowerCase()}`,
      ];

      const lp = await LearningPath.create({
        userId,
        skillId,
        recommendedResources: resources,
      });

      learningPaths.push(lp);
    }

    res.status(201).json({ message: "Learning path generated successfully", learningPaths });
  } catch (error) {
    console.error("Error generating learning path:", error);
    res.status(500).json({ message: "Error generating learning path", error });
  }
};

// AI-Powered Learning Path Generation
export const generateAILearningPath = async (req, res) => {
  try {
    const { selectedSkills, targetRole, currentLevel } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(401).json({ message: "User authentication required" });
    }

    // Fetch user's skills from MongoDB
    const userSkills = await Skill.find({ user: userId });

    // Fetch user's assessment scores
    const assessments = await Assessment.find({ user: userId });
    const assessmentScores = {};
    assessments.forEach(assessment => {
      assessmentScores[assessment.skill] = assessment.score;
    });

    // Prepare data for AI
    const userData = {
      skills: userSkills.map(skill => ({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency
      })),
      assessmentScores,
      selectedSkills: selectedSkills || [],
      targetRole: targetRole || 'Not specified',
      currentLevel: currentLevel || 'Intermediate'
    };

    // Generate learning path using Grok AI
    const learningPath = await grokAI.generateLearningPath(userData);

    res.status(200).json({
      success: true,
      learningPath,
      userData: {
        totalSkills: userSkills.length,
        assessmentsTaken: assessments.length,
        targetRole,
        currentLevel
      }
    });

  } catch (error) {
    console.error('AI Learning Path Generation Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate AI learning path'
    });
  }
};

// Get AI recommendations for a specific skill
export const getSkillRecommendation = async (req, res) => {
  try {
    const { skillName, currentProficiency } = req.body;

    if (!skillName) {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required'
      });
    }

    const recommendation = await grokAI.getSkillRecommendations(
      skillName,
      currentProficiency || 0
    );

    res.status(200).json({
      success: true,
      recommendation
    });

  } catch (error) {
    console.error('Skill Recommendation Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get skill recommendations'
    });
  }
};

// Analyze assessment with AI
export const analyzeAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!assessmentId) {
      return res.status(400).json({
        success: false,
        message: 'Assessment ID is required'
      });
    }

    const assessment = await Assessment.findOne({
      _id: assessmentId,
      user: userId
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    const analysis = await grokAI.analyzeAssessment(
      assessment.skill,
      assessment.score,
      assessment.answers
    );

    res.status(200).json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Assessment Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze assessment'
    });
  }
};

// Check AI service status
export const checkAIStatus = async (req, res) => {
  try {
    const groqConfigured = !!process.env.GROQ_API_KEY;
    const grokConfigured = !!process.env.GROK_API_KEY;
    const apiKeyConfigured = groqConfigured || grokConfigured;
    
    const aiProvider = groqConfigured ? 'Groq Cloud' : grokConfigured ? 'Grok AI (xAI)' : 'None';
    
    res.status(200).json({
      success: true,
      aiEnabled: apiKeyConfigured,
      provider: aiProvider,
      message: apiKeyConfigured 
        ? `AI service is available (${aiProvider})` 
        : 'AI service requires API key configuration (GROQ_API_KEY or GROK_API_KEY)'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check AI service status'
    });
  }
};

// Save AI learning path
export const saveAILearningPath = async (req, res) => {
  try {
    const { title, selectedSkills, targetRole, currentLevel, aiResponse, sections, resources, isFavorite } = req.body;
    const userId = req.user?.id || req.user?._id || req.body.userId;

    console.log('💾 Saving Learning Path:');
    console.log('   User ID:', userId);
    console.log('   Title:', title);
    console.log('   Has AI Response:', !!aiResponse);

    if (!userId || !aiResponse) {
      return res.status(400).json({
        success: false,
        message: 'User ID and AI response are required'
      });
    }

    const learningPath = new AILearningPath({
      user: userId,
      title: title || `Learning Path - ${new Date().toLocaleDateString()}`,
      selectedSkills: selectedSkills || [],
      targetRole: targetRole || '',
      currentLevel: currentLevel || 'Intermediate',
      aiResponse,
      sections: sections || {},
      resources: resources || [],
      isFavorite: isFavorite || false
    });

    await learningPath.save();

    console.log('✅ Learning path saved successfully:', learningPath._id);

    res.status(201).json({
      success: true,
      message: 'Learning path saved successfully',
      learningPath
    });

  } catch (error) {
    console.error('❌ Save Learning Path Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to save learning path'
    });
  }
};

// Get all saved learning paths for user
export const getSavedLearningPaths = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;

    const learningPaths = await AILearningPath.find({ user: userId })
      .sort({ createdAt: -1 })
      .select('-aiResponse'); // Exclude full response for list view

    res.status(200).json({
      success: true,
      count: learningPaths.length,
      learningPaths
    });

  } catch (error) {
    console.error('Get Learning Paths Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve learning paths'
    });
  }
};

// Get single learning path by ID
export const getLearningPathById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const learningPath = await AILearningPath.findOne({
      _id: id,
      user: userId
    });

    if (!learningPath) {
      return res.status(404).json({
        success: false,
        message: 'Learning path not found'
      });
    }

    res.status(200).json({
      success: true,
      learningPath
    });

  } catch (error) {
    console.error('Get Learning Path Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve learning path'
    });
  }
};

// Delete learning path
export const deleteLearningPath = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const learningPath = await AILearningPath.findOneAndDelete({
      _id: id,
      user: userId
    });

    if (!learningPath) {
      return res.status(404).json({
        success: false,
        message: 'Learning path not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Learning path deleted successfully'
    });

  } catch (error) {
    console.error('Delete Learning Path Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete learning path'
    });
  }
};

// Update learning path (favorite, progress, notes)
export const updateLearningPath = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { isFavorite, progress, notes } = req.body;

    const learningPath = await AILearningPath.findOneAndUpdate(
      { _id: id, user: userId },
      { isFavorite, progress, notes },
      { new: true }
    );

    if (!learningPath) {
      return res.status(404).json({
        success: false,
        message: 'Learning path not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Learning path updated successfully',
      learningPath
    });

  } catch (error) {
    console.error('Update Learning Path Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update learning path'
    });
  }
};

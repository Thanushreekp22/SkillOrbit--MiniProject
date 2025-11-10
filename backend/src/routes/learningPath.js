const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const grokAI = require('../services/grokAI');
const Skill = require('../models/Skill');
const Assessment = require('../models/Assessment');

/**
 * @route   POST /api/learning-path/generate
 * @desc    Generate AI-powered learning path recommendations
 * @access  Private
 */
router.post('/generate', auth, async (req, res) => {
  try {
    const { selectedSkills, targetRole, currentLevel } = req.body;
    const userId = req.user.id;

    // Fetch user's skills
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

    res.json({
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
    console.error('Learning Path Generation Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate learning path'
    });
  }
});

/**
 * @route   POST /api/learning-path/skill-recommendation
 * @desc    Get AI recommendations for a specific skill
 * @access  Private
 */
router.post('/skill-recommendation', auth, async (req, res) => {
  try {
    const { skillName, currentProficiency } = req.body;

    if (!skillName) {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required'
      });
    }

    // Get AI recommendations
    const recommendation = await grokAI.getSkillRecommendations(
      skillName,
      currentProficiency || 0
    );

    res.json({
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
});

/**
 * @route   POST /api/learning-path/analyze-assessment
 * @desc    Analyze assessment results with AI
 * @access  Private
 */
router.post('/analyze-assessment', auth, async (req, res) => {
  try {
    const { assessmentId } = req.body;
    const userId = req.user.id;

    // Fetch assessment
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

    // Analyze with AI
    const analysis = await grokAI.analyzeAssessment(
      assessment.skill,
      assessment.score,
      assessment.answers
    );

    res.json({
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
});

/**
 * @route   GET /api/learning-path/status
 * @desc    Check if AI service is available
 * @access  Private
 */
router.get('/status', auth, async (req, res) => {
  try {
    const apiKeyConfigured = !!process.env.GROK_API_KEY;
    
    res.json({
      success: true,
      aiEnabled: apiKeyConfigured,
      message: apiKeyConfigured 
        ? 'AI service is available' 
        : 'AI service requires API key configuration'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check AI service status'
    });
  }
});

module.exports = router;

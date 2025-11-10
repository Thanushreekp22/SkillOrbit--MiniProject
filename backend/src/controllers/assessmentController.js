import { Assessment, User, QuestionBank, UserQuestionnaire } from "../models/index.js";
import mongoose from "mongoose";

// Start a new assessment
export const startAssessment = async (req, res) => {
  try {
    const { skillName, difficulty = 'basic' } = req.body;
    const userId = req.user.id;

    // Get questions for this skill and difficulty
    const questions = await QuestionBank.find({ 
      skillName: new RegExp(skillName, 'i'), 
      difficulty 
    }).limit(10); // Limit to 10 questions per assessment

    if (questions.length === 0) {
      return res.status(404).json({ 
        message: "No questions found for this skill and difficulty level" 
      });
    }

    // Create new assessment
    const assessment = await Assessment.create({
      userId,
      skillName,
      difficulty,
      totalQuestions: questions.length,
      correctAnswers: 0,
      score: 0,
      status: 'in_progress',
      questions: questions.map(q => ({
        questionId: q._id,
        userAnswer: '',
        correctAnswer: q.correctAnswer,
        isCorrect: false,
        timeSpent: 0
      }))
    });

    // Return questions without correct answers
    const questionsForUser = questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      questionType: q.questionType
    }));

    res.status(201).json({ 
      message: "Assessment started successfully", 
      assessmentId: assessment._id,
      questions: questionsForUser,
      totalQuestions: questions.length,
      difficulty
    });
  } catch (error) {
    console.error("Error starting assessment:", error);
    res.status(500).json({ message: "Error starting assessment", error: error.message });
  }
};

// Submit assessment answers
export const submitAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { answers, timeSpent = 0 } = req.body; // answers: [{ questionId, userAnswer, timeSpent }]
    const userId = req.user.id;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    if (assessment.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access to assessment" });
    }

    if (assessment.status === 'completed') {
      return res.status(400).json({ 
        message: "Assessment already completed. Please start a new assessment.",
        alreadyCompleted: true
      });
    }

    let correctAnswers = 0;
    const updatedQuestions = assessment.questions.map(q => {
      const userAnswer = answers.find(a => a.questionId === q.questionId.toString());
      if (userAnswer) {
        // Normalize both answers for comparison
        const userAnswerNormalized = userAnswer.userAnswer.toLowerCase().trim();
        const correctAnswerNormalized = q.correctAnswer.toLowerCase().trim();
        const isCorrect = userAnswerNormalized === correctAnswerNormalized;
        
        // Debug logging
        console.log('Answer comparison:', {
          questionId: q.questionId.toString(),
          userAnswer: userAnswerNormalized,
          correctAnswer: correctAnswerNormalized,
          isCorrect
        });
        
        if (isCorrect) correctAnswers++;
        
        return {
          ...q,
          userAnswer: userAnswer.userAnswer,
          isCorrect,
          timeSpent: userAnswer.timeSpent || 0
        };
      }
      return q;
    });

    const score = Math.round((correctAnswers / assessment.totalQuestions) * 100);
    
    // Generate feedback based on score
    let feedback = '';
    if (score >= 90) feedback = 'Excellent! You have mastered this skill.';
    else if (score >= 75) feedback = 'Good job! You have a strong understanding.';
    else if (score >= 60) feedback = 'Fair performance. Consider reviewing key concepts.';
    else feedback = 'Needs improvement. Focus on fundamental concepts.';

    // Update assessment
    assessment.correctAnswers = correctAnswers;
    assessment.score = score;
    assessment.timeSpent = timeSpent;
    assessment.feedback = feedback;
    assessment.status = 'completed';
    assessment.questions = updatedQuestions;
    
    console.log('Saving assessment...');
    const savedAssessment = await assessment.save();
    console.log('Assessment saved successfully');

    console.log('Assessment completed:', {
      assessmentId: savedAssessment._id,
      skillName: savedAssessment.skillName,
      correctAnswers,
      totalQuestions: savedAssessment.totalQuestions,
      score
    });

    // Prepare response data
    const responseData = {
      message: "Assessment completed successfully", 
      assessment: {
        _id: savedAssessment._id,
        skillName: savedAssessment.skillName,
        difficulty: savedAssessment.difficulty,
        score,
        correctAnswers,
        totalQuestions: savedAssessment.totalQuestions,
        feedback,
        timeSpent,
        questions: updatedQuestions
      }
    };

    console.log('Sending response...');
    res.status(200).json(responseData);
    console.log('Response sent successfully');
  } catch (error) {
    console.error("Error submitting assessment:", error);
    console.error("Error stack:", error.stack);
    
    // Send proper error response
    if (!res.headersSent) {
      res.status(500).json({ 
        message: "Error submitting assessment", 
        error: error.message 
      });
    }
  }
};

// Get user's assessment history
export const getUserAssessments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skillName, page = 1, limit = 10 } = req.query;

    const filter = { userId };
    if (skillName) {
      filter.skillName = new RegExp(skillName, 'i');
    }

    const assessments = await Assessment.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-questions'); // Exclude detailed questions for list view

    const total = await Assessment.countDocuments(filter);

    res.json({
      assessments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Error fetching user assessments:", error);
    res.status(500).json({ message: "Error fetching assessments", error: error.message });
  }
};

// Get detailed assessment results
export const getAssessmentDetails = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const userId = req.user.id;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    if (assessment.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access to assessment" });
    }

    // Get question details
    const questionIds = assessment.questions.map(q => q.questionId);
    const questions = await QuestionBank.find({ _id: { $in: questionIds } });

    const detailedResults = assessment.questions.map(q => {
      const questionDetail = questions.find(qd => qd._id.toString() === q.questionId.toString());
      return {
        question: questionDetail?.questionText || 'Question not found',
        options: questionDetail?.options || [],
        userAnswer: q.userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect: q.isCorrect,
        timeSpent: q.timeSpent,
        explanation: questionDetail?.explanation || ''
      };
    });

    res.json({
      assessment: {
        _id: assessment._id,
        skillName: assessment.skillName,
        difficulty: assessment.difficulty,
        score: assessment.score,
        correctAnswers: assessment.correctAnswers,
        totalQuestions: assessment.totalQuestions,
        feedback: assessment.feedback,
        timeSpent: assessment.timeSpent,
        status: assessment.status,
        createdAt: assessment.createdAt
      },
      results: detailedResults
    });
  } catch (error) {
    console.error("Error fetching assessment details:", error);
    res.status(500).json({ message: "Error fetching assessment details", error: error.message });
  }
};

// Get assessment statistics
export const getAssessmentStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Assessment.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$skillName",
          totalAssessments: { $sum: 1 },
          averageScore: { $avg: "$score" },
          bestScore: { $max: "$score" },
          lastAssessment: { $max: "$createdAt" },
          difficulties: { $addToSet: "$difficulty" }
        }
      },
      { $sort: { averageScore: -1 } }
    ]);

    const overallStats = await Assessment.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalAssessments: { $sum: 1 },
          averageScore: { $avg: "$score" },
          skillsCovered: { $addToSet: "$skillName" }
        }
      }
    ]);

    res.json({
      skillStats: stats,
      overallStats: overallStats[0] || {
        totalAssessments: 0,
        averageScore: 0,
        skillsCovered: []
      }
    });
  } catch (error) {
    console.error("Error fetching assessment stats:", error);
    res.status(500).json({ message: "Error fetching assessment stats", error: error.message });
  }
};

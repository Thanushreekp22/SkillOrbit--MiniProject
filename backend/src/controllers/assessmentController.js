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

    let detailedResults;

    // Handle AI-generated expert assessments differently
    if (assessment.isAIGenerated && assessment.difficulty === 'expert') {
      // For expert assessments, questions are embedded in the assessment
      detailedResults = assessment.questions.map((q, index) => ({
        questionNumber: index + 1,
        questionType: q.questionType,
        question: q.questionText,
        options: q.options || [],
        userAnswer: q.userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect: q.isCorrect,
        timeSpent: q.timeSpent,
        explanation: q.explanation || '',
        category: q.questionType === 'mcq' || q.questionType === 'true-false' || q.questionType === 'short-answer' ? 'theory' : 'practical'
      }));
    } else {
      // For regular assessments, fetch from QuestionBank
      const questionIds = assessment.questions.map(q => q.questionId).filter(id => id);
      const questions = await QuestionBank.find({ _id: { $in: questionIds } });

      detailedResults = assessment.questions.map((q, index) => {
        const questionDetail = questions.find(qd => qd._id.toString() === q.questionId?.toString());
        return {
          questionNumber: index + 1,
          questionType: questionDetail?.questionType || 'mcq',
          question: questionDetail?.questionText || 'Question not found',
          options: questionDetail?.options || [],
          userAnswer: q.userAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect: q.isCorrect,
          timeSpent: q.timeSpent,
          explanation: questionDetail?.explanation || ''
        };
      });
    }

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
        createdAt: assessment.createdAt,
        isAIGenerated: assessment.isAIGenerated || false
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

// Generate Expert Level Assessment with AI
export const generateExpertAssessment = async (req, res) => {
  try {
    const { skillName } = req.body;
    const userId = req.user.id;

    if (!skillName) {
      return res.status(400).json({ message: "Skill name is required" });
    }

    console.log(`🤖 Generating expert assessment for ${skillName}...`);

    // Import AI service
    const grokAI = (await import('../services/grokAI.js')).default;
    
    // Generate questions using AI
    const aiResponse = await grokAI.generateExpertQuestions(skillName);
    
    if (!aiResponse.questions || aiResponse.questions.length === 0) {
      return res.status(500).json({ 
        message: "Failed to generate questions. Please try again." 
      });
    }

    // Create assessment with AI-generated questions
    const assessment = await Assessment.create({
      userId,
      skillName,
      difficulty: 'expert',
      isAIGenerated: true,
      totalQuestions: aiResponse.questions.length,
      correctAnswers: 0,
      score: 0,
      status: 'in_progress',
      questions: aiResponse.questions.map(q => ({
        questionText: q.question,
        questionType: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        isCorrect: false,
        userAnswer: '',
        timeSpent: 0
      }))
    });

    // Prepare questions for user (without answers)
    const questionsForUser = aiResponse.questions.map((q, index) => ({
      id: index + 1,
      questionText: q.question,
      questionType: q.type,
      category: q.category,
      options: q.options || []
    }));

    console.log(`✅ Expert assessment created: ${assessment._id}`);

    res.status(201).json({
      message: "Expert assessment generated successfully",
      assessmentId: assessment._id,
      questions: questionsForUser,
      totalQuestions: aiResponse.questions.length,
      difficulty: 'expert',
      isAIGenerated: true,
      distribution: {
        theory: aiResponse.theoryCount,
        practical: aiResponse.practicalCount
      }
    });

  } catch (error) {
    console.error("❌ Error generating expert assessment:", error);
    res.status(500).json({ 
      message: "Error generating expert assessment", 
      error: error.message 
    });
  }
};

// Submit Expert Assessment
export const submitExpertAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { answers, timeSpent = 0 } = req.body;
    const userId = req.user.id;

    const assessment = await Assessment.findById(assessmentId);
    
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    if (assessment.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (assessment.status === 'completed') {
      return res.status(400).json({ message: "Assessment already completed" });
    }

    if (!assessment.isAIGenerated || assessment.difficulty !== 'expert') {
      return res.status(400).json({ message: "Not an expert assessment" });
    }

    let correctCount = 0;
    const evaluatedQuestions = [];

    // Evaluate answers
    for (let i = 0; i < assessment.questions.length; i++) {
      const question = assessment.questions[i];
      const userAnswer = answers[i]?.answer || '';
      const answerTimeSpent = answers[i]?.timeSpent || 0;

      let isCorrect = false;

      // Evaluate based on question type
      if (question.questionType === 'mcq' || question.questionType === 'true-false' || question.questionType === 'code-mcq') {
        // Exact match for MCQ, True/False, and Code MCQ
        isCorrect = userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
      } else if (question.questionType === 'short-answer') {
        // Keyword-based matching for short answers (simplified)
        const correctKeywords = question.correctAnswer.toLowerCase().split(' ');
        const userKeywords = userAnswer.toLowerCase().split(' ');
        const matchCount = correctKeywords.filter(kw => userKeywords.includes(kw)).length;
        isCorrect = matchCount >= correctKeywords.length * 0.5; // 50% keyword match
      } else if (question.questionType === 'code-typing' || question.questionType === 'practical') {
        // For code typing and practical questions, check if answer contains key concepts
        if (userAnswer && userAnswer.trim().length > 0) {
          const correctLower = question.correctAnswer.toLowerCase();
          const userLower = userAnswer.toLowerCase();
          // More lenient for code: check if at least 30% of expected keywords are present
          const correctKeywords = correctLower.split(/\s+/).filter(word => word.length > 3);
          const userKeywords = userLower.split(/\s+/);
          const matchCount = correctKeywords.filter(kw => userKeywords.some(uk => uk.includes(kw))).length;
          // Remove minimum length requirement, just check keyword match
          isCorrect = matchCount >= Math.max(1, correctKeywords.length * 0.3);
        } else {
          isCorrect = false; // Empty answer is incorrect
        }
      }

      if (isCorrect) correctCount++;

      question.userAnswer = userAnswer;
      question.isCorrect = isCorrect;
      question.timeSpent = answerTimeSpent;

      evaluatedQuestions.push({
        questionText: question.questionText,
        questionType: question.questionType,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      });
    }

    const score = Math.round((correctCount / assessment.questions.length) * 100);

    assessment.correctAnswers = correctCount;
    assessment.score = score;
    assessment.timeSpent = timeSpent;
    assessment.status = 'completed';
    
    await assessment.save();

    // Update user's skill proficiency
    await User.findByIdAndUpdate(userId, {
      $addToSet: { skillsToImprove: assessment.skillName }
    });

    const responseData = {
      message: "Expert assessment submitted successfully",
      assessment: {
        _id: assessment._id,
        skillName: assessment.skillName,
        difficulty: assessment.difficulty,
        score,
        correctAnswers: correctCount,
        totalQuestions: assessment.questions.length,
        feedback: score >= 80 ? "Excellent! Expert level achieved." :
                  score >= 60 ? "Good job! Keep practicing for mastery." :
                  "Keep learning. Review the explanations and try again.",
        timeSpent,
        questions: evaluatedQuestions,
        isAIGenerated: true
      }
    };

    res.json(responseData);

  } catch (error) {
    console.error("❌ Error submitting expert assessment:", error);
    res.status(500).json({ 
      message: "Error submitting assessment", 
      error: error.message 
    });
  }
};

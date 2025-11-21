import { QuestionBank } from "../models/index.js";
import { User, Assessment, Skill } from "../models/index.js";

// Get All Questions with Filters
export const getAllQuestions = async (req, res) => {
  try {
    const { 
      skillName, 
      difficulty, 
      questionType, 
      page = 1, 
      limit = 20,
      search 
    } = req.query;

    const filter = {};
    
    if (skillName) {
      filter.skillName = new RegExp(skillName, 'i');
    }
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    
    if (questionType) {
      filter.questionType = questionType;
    }

    if (search) {
      filter.$or = [
        { questionText: new RegExp(search, 'i') },
        { skillName: new RegExp(search, 'i') }
      ];
    }

    const questions = await QuestionBank.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await QuestionBank.countDocuments(filter);

    res.json({
      questions,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error("Get all questions error:", error);
    res.status(500).json({ message: "Failed to get questions", error: error.message });
  }
};

// Get Question by ID
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await QuestionBank.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ question });
  } catch (error) {
    console.error("Get question error:", error);
    res.status(500).json({ message: "Failed to get question", error: error.message });
  }
};

// Add New Question
export const addQuestion = async (req, res) => {
  try {
    const {
      skillName,
      questionText,
      options,
      correctAnswer,
      difficulty,
      questionType,
      explanation,
      tags
    } = req.body;

    // Validation
    if (!skillName || !questionText || !correctAnswer || !difficulty) {
      return res.status(400).json({ 
        message: "Required fields: skillName, questionText, correctAnswer, difficulty" 
      });
    }

    if (questionType === 'mcq' && (!options || options.length < 2)) {
      return res.status(400).json({ 
        message: "MCQ questions must have at least 2 options" 
      });
    }

    // Create question
    const question = await QuestionBank.create({
      skillName,
      questionText,
      options: options || [],
      correctAnswer,
      difficulty,
      questionType: questionType || 'mcq',
      explanation: explanation || '',
      tags: tags || [],
      createdBy: req.user.id
    });

    res.status(201).json({
      message: "Question added successfully",
      question
    });
  } catch (error) {
    console.error("Add question error:", error);
    res.status(500).json({ message: "Failed to add question", error: error.message });
  }
};

// Update Question
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      skillName,
      questionText,
      options,
      correctAnswer,
      difficulty,
      questionType,
      explanation,
      tags
    } = req.body;

    const question = await QuestionBank.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Update fields
    if (skillName) question.skillName = skillName;
    if (questionText) question.questionText = questionText;
    if (options) question.options = options;
    if (correctAnswer) question.correctAnswer = correctAnswer;
    if (difficulty) question.difficulty = difficulty;
    if (questionType) question.questionType = questionType;
    if (explanation !== undefined) question.explanation = explanation;
    if (tags) question.tags = tags;

    question.updatedBy = req.user.id;
    question.updatedAt = new Date();

    await question.save();

    res.json({
      message: "Question updated successfully",
      question
    });
  } catch (error) {
    console.error("Update question error:", error);
    res.status(500).json({ message: "Failed to update question", error: error.message });
  }
};

// Delete Question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await QuestionBank.findByIdAndDelete(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({
      message: "Question deleted successfully",
      deletedQuestion: {
        id: question._id,
        skillName: question.skillName,
        questionText: question.questionText
      }
    });
  } catch (error) {
    console.error("Delete question error:", error);
    res.status(500).json({ message: "Failed to delete question", error: error.message });
  }
};

// Bulk Add Questions
export const bulkAddQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions array is required" });
    }

    // Add createdBy to all questions
    const questionsWithCreator = questions.map(q => ({
      ...q,
      createdBy: req.user.id
    }));

    const insertedQuestions = await QuestionBank.insertMany(questionsWithCreator);

    res.status(201).json({
      message: `${insertedQuestions.length} questions added successfully`,
      count: insertedQuestions.length,
      questions: insertedQuestions
    });
  } catch (error) {
    console.error("Bulk add questions error:", error);
    res.status(500).json({ message: "Failed to add questions", error: error.message });
  }
};

// Get Question Statistics
export const getQuestionStatistics = async (req, res) => {
  try {
    const totalQuestions = await QuestionBank.countDocuments();

    // Questions by skill
    const questionsBySkill = await QuestionBank.aggregate([
      { $group: { _id: "$skillName", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Questions by difficulty
    const questionsByDifficulty = await QuestionBank.aggregate([
      { $group: { _id: "$difficulty", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Questions by type
    const questionsByType = await QuestionBank.aggregate([
      { $group: { _id: "$questionType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalQuestions,
      questionsBySkill,
      questionsByDifficulty,
      questionsByType
    });
  } catch (error) {
    console.error("Get question statistics error:", error);
    res.status(500).json({ message: "Failed to get statistics", error: error.message });
  }
};

// Get Platform Analytics
export const getPlatformAnalytics = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();
    
    // Total assessments
    const totalAssessments = await Assessment.countDocuments();
    
    // Total skills tracked
    const totalSkills = await Skill.countDocuments();
    
    // Total questions
    const totalQuestions = await QuestionBank.countDocuments();

    // Users joined per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowth = await User.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sixMonthsAgo } 
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Assessment activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const assessmentActivity = await Assessment.aggregate([
      { 
        $match: { 
          createdAt: { $gte: thirtyDaysAgo } 
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Top performing skills
    const topSkills = await Skill.aggregate([
      {
        $group: {
          _id: "$name",
          avgProficiency: { $avg: "$proficiency" },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgProficiency: -1 } },
      { $limit: 10 }
    ]);

    // Average scores by difficulty
    const scoresByDifficulty = await Assessment.aggregate([
      {
        $group: {
          _id: "$difficulty",
          avgScore: { $avg: "$score" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Most active users (by assessment count)
    const mostActiveUsers = await Assessment.aggregate([
      {
        $group: {
          _id: "$userId",
          assessmentCount: { $sum: 1 },
          avgScore: { $avg: "$score" }
        }
      },
      { $sort: { assessmentCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 1,
          assessmentCount: 1,
          avgScore: 1,
          userName: "$userDetails.name",
          userEmail: "$userDetails.email"
        }
      }
    ]);

    // Skills distribution by category
    const skillsByCategory = await Skill.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgProficiency: { $avg: "$proficiency" }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalAssessments,
        totalSkills,
        totalQuestions
      },
      userGrowth,
      assessmentActivity,
      topSkills,
      scoresByDifficulty,
      mostActiveUsers,
      skillsByCategory
    });
  } catch (error) {
    console.error("Get platform analytics error:", error);
    res.status(500).json({ message: "Failed to get analytics", error: error.message });
  }
};

// Get User Management Data
export const getUserManagementData = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get assessment count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const assessmentCount = await Assessment.countDocuments({ userId: user._id });
        const skillCount = await Skill.countDocuments({ userId: user._id });
        
        const recentAssessment = await Assessment.findOne({ userId: user._id })
          .sort({ createdAt: -1 })
          .select('createdAt');

        return {
          ...user.toObject(),
          assessmentCount,
          skillCount,
          lastActive: recentAssessment?.createdAt || user.createdAt
        };
      })
    );

    const total = await User.countDocuments(filter);

    res.json({
      users: usersWithStats,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error("Get user management data error:", error);
    res.status(500).json({ message: "Failed to get user data", error: error.message });
  }
};

// Export Questions (JSON format)
export const exportQuestions = async (req, res) => {
  try {
    const { skillName, difficulty } = req.query;

    const filter = {};
    if (skillName) filter.skillName = new RegExp(skillName, 'i');
    if (difficulty) filter.difficulty = difficulty;

    const questions = await QuestionBank.find(filter).select('-createdBy -updatedBy');

    res.json({
      message: "Questions exported successfully",
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error("Export questions error:", error);
    res.status(500).json({ message: "Failed to export questions", error: error.message });
  }
};

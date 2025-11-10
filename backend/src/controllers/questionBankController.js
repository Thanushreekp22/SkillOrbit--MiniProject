import { QuestionBank } from "../models/index.js";

// Create a new question
export const createQuestion = async (req, res) => {
  try {
    const { skillName, questionText, options, correctAnswer, difficulty, questionType, explanation } = req.body;

    const question = await QuestionBank.create({
      skillName,
      questionText,
      options,
      correctAnswer,
      difficulty,
      questionType,
      explanation
    });

    res.status(201).json({ message: "Question created successfully", question });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: "Error creating question", error: error.message });
  }
};

// Get all questions with filtering
export const getAllQuestions = async (req, res) => {
  try {
    const { skillName, difficulty, questionType, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (skillName) filter.skillName = new RegExp(skillName, 'i');
    if (difficulty) filter.difficulty = difficulty;
    if (questionType) filter.questionType = questionType;

    const questions = await QuestionBank.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await QuestionBank.countDocuments(filter);

    res.json({
      questions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions", error: error.message });
  }
};

// Get questions by skill
export const getQuestionsBySkill = async (req, res) => {
  try {
    const { skillName } = req.params;
    const { difficulty, limit = 10 } = req.query;

    const filter = { skillName: new RegExp(skillName, 'i') };
    if (difficulty) filter.difficulty = difficulty;

    const questions = await QuestionBank.find(filter)
      .limit(parseInt(limit))
      .select('-correctAnswer'); // Don't send correct answers for practice mode

    res.json({ questions, total: questions.length });
  } catch (error) {
    console.error("Error fetching questions by skill:", error);
    res.status(500).json({ message: "Error fetching questions", error: error.message });
  }
};

// Get question by ID
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await QuestionBank.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Error fetching question", error: error.message });
  }
};

// Update question
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { skillName, questionText, options, correctAnswer, difficulty, questionType, explanation } = req.body;

    const question = await QuestionBank.findByIdAndUpdate(
      id,
      { skillName, questionText, options, correctAnswer, difficulty, questionType, explanation },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question updated successfully", question });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Error updating question", error: error.message });
  }
};

// Delete question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await QuestionBank.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Error deleting question", error: error.message });
  }
};

// Bulk create questions
export const bulkCreateQuestions = async (req, res) => {
  try {
    const { questions } = req.body; // Array of question objects

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions array is required" });
    }

    const createdQuestions = await QuestionBank.insertMany(questions);

    res.status(201).json({ 
      message: `${createdQuestions.length} questions created successfully`, 
      questions: createdQuestions 
    });
  } catch (error) {
    console.error("Error bulk creating questions:", error);
    res.status(500).json({ message: "Error creating questions", error: error.message });
  }
};

// Get question statistics
export const getQuestionStats = async (req, res) => {
  try {
    const stats = await QuestionBank.aggregate([
      {
        $group: {
          _id: "$skillName",
          totalQuestions: { $sum: 1 },
          difficulties: { $addToSet: "$difficulty" },
          questionTypes: { $addToSet: "$questionType" }
        }
      },
      { $sort: { totalQuestions: -1 } }
    ]);

    const overallStats = await QuestionBank.aggregate([
      {
        $group: {
          _id: null,
          totalQuestions: { $sum: 1 },
          skillsCovered: { $addToSet: "$skillName" },
          difficultiesAvailable: { $addToSet: "$difficulty" },
          questionTypesAvailable: { $addToSet: "$questionType" }
        }
      }
    ]);

    res.json({
      skillStats: stats,
      overallStats: overallStats[0] || {
        totalQuestions: 0,
        skillsCovered: [],
        difficultiesAvailable: [],
        questionTypesAvailable: []
      }
    });
  } catch (error) {
    console.error("Error fetching question stats:", error);
    res.status(500).json({ message: "Error fetching question stats", error: error.message });
  }
};

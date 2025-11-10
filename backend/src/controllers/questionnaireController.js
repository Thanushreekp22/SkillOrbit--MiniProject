import User from "../models/User.js";
import Role from "../models/Role.js";
import Skill from "../models/skillModel.js";
import QuestionBank from "../models/QuestionBank.js";
import UserQuestionnaire from "../models/UserQuestionnaire.js";

// ➤ Generate a personalized questionnaire for a user
export const generateQuestionnaire = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Fetch user’s roles and their skills
    const roles = await Role.findAll({
      include: [{ model: Skill }],
    });

    // Collect all skill IDs related to those roles
    const skillIds = roles.flatMap(role => role.Skills?.map(skill => skill.id)) || [];

    if (skillIds.length === 0)
      return res.status(400).json({ message: "No skills found for user roles." });

    // Fetch all related questions
    const questions = await QuestionBank.findAll({
      where: { skillId: skillIds },
      limit: 10, // Customize number of questions per test
    });

    if (questions.length === 0)
      return res.status(404).json({ message: "No questions found for the user's skills." });

    // Create questionnaire entries for user
    const userQuestions = await Promise.all(
      questions.map((q) =>
        UserQuestionnaire.create({
          userId,
          questionId: q.id,
        })
      )
    );

    res.status(201).json({
      message: "Questionnaire generated successfully",
      totalQuestions: userQuestions.length,
      userQuestions,
    });
  } catch (error) {
    console.error("Error generating questionnaire:", error);
    res.status(500).json({ message: "Error generating questionnaire", error });
  }
};

// ➤ Fetch all questions for a user’s current questionnaire
export const getUserQuestionnaire = async (req, res) => {
  try {
    const { userId } = req.params;

    const questionnaire = await UserQuestionnaire.findAll({
      where: { userId },
      include: [
        {
          model: QuestionBank,
          attributes: ["questionText", "options", "correctAnswer"],
        },
      ],
    });

    res.json(questionnaire);
  } catch (error) {
    console.error("Error fetching questionnaire:", error);
    res.status(500).json({ message: "Error fetching questionnaire", error });
  }
};

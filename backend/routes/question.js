const Answer = require("../models/Answer");
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const User = require("../models/User");
const auth = require("../middleware/auth");

// ASK QUESTION (Protected - requires login)
router.post("/ask", auth, async (req, res) => {
  try {
    const { title, description, category, language } = req.body;

    // Create new question with user ID from token
    const newQuestion = new Question({
      title,
      description,
      category,
      language,
      user: req.user.id
    });

    await newQuestion.save();

    res.status(201).json({ 
      message: "Question posted successfully",
      question: newQuestion 
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET ALL QUESTIONS
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("user", "name bio")
      .sort({ createdAt: -1 });
    
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET SINGLE QUESTION BY ID
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("user", "name bio");
    
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// GET QUESTIONS BY CATEGORY
router.get("/category/:category", async (req, res) => {
  try {
    const questions = await Question.find({ 
      category: req.params.category 
    })
    .populate("user", "name bio")
    .sort({ createdAt: -1 });
    
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// UPDATE QUESTION (Protected - only by owner)
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, category, language } = req.body;
    
    // Find question
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    
    // Check if user owns this question
    if (question.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own questions" });
    }
    
    // Update question
    question.title = title || question.title;
    question.description = description || question.description;
    question.category = category || question.category;
    question.language = language || question.language;
    
    await question.save();
    
    res.status(200).json({ 
      message: "Question updated successfully",
      question 
    });
    
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// DELETE QUESTION (Protected - only by owner)
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find question
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    
    // Check if user owns this question
    if (question.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own questions" });
    }
    
    // Delete the question
    await Question.findByIdAndDelete(req.params.id);
    
    // Also delete all answers for this question
    await Answer.deleteMany({ question: req.params.id });
    
    res.status(200).json({ message: "Question deleted successfully" });
    
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
module.exports = router;
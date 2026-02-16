const express = require("express");
const router = express.Router();
const Answer = require("../models/Answer");
const Question = require("../models/Question");
const auth = require("../middleware/auth");

// POST ANSWER (Protected - requires login)
router.post("/:questionId", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const { questionId } = req.params;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Create new answer
    const newAnswer = new Answer({
      content,
      question: questionId,
      user: req.user.id
    });

    await newAnswer.save();

    res.status(201).json({ 
      message: "Answer posted successfully",
      answer: newAnswer 
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET ALL ANSWERS FOR A QUESTION
router.get("/question/:questionId", async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate("user", "name bio")
      .sort({ createdAt: -1 });
    
    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// UPDATE ANSWER (Protected - only by owner)
router.put("/:id", auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    // Find answer
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    
    // Check if user owns this answer
    if (answer.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own answers" });
    }
    
    // Update answer
    answer.content = content || answer.content;
    
    await answer.save();
    
    res.status(200).json({ 
      message: "Answer updated successfully",
      answer 
    });
    
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// DELETE ANSWER (Protected - only by owner)
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find answer
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    
    // Check if user owns this answer
    if (answer.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own answers" });
    }
    
    // Delete the answer
    await Answer.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: "Answer deleted successfully" });
    
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
module.exports = router;
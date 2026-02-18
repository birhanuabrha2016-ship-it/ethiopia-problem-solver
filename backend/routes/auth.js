const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const auth = require("../middleware/auth");
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

// REGISTER USER (AUTO-CONFIRMED FOR TESTING)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create verification token (optional - we won't use it)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      bio,
      verificationToken,
      verificationTokenExpiry
    });

    await newUser.save();

    // AUTO-CONFIRM USER (SKIP EMAIL VERIFICATION)
    newUser.isVerified = true;
    newUser.verificationToken = undefined;
    newUser.verificationTokenExpiry = undefined;
    await newUser.save();

    // Send response - user can login immediately
    res.status(201).json({ 
      message: "Registration successful! You can now login." 
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create JWT Token
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Send response (without password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      role: user.role
    };

    res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET USER PROFILE (Protected)
router.get("/profile/:userId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET USER'S QUESTIONS
router.get("/:userId/questions", async (req, res) => {
  try {
    const questions = await Question.find({ user: req.params.userId })
      .sort({ createdAt: -1 });
    
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET USER'S ANSWERS
router.get("/:userId/answers", async (req, res) => {
  try {
    const answers = await Answer.find({ user: req.params.userId })
      .populate("question", "title")
      .sort({ createdAt: -1 });
    
    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// VERIFY EMAIL
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }
    
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    
    await user.save();
    
    res.status(200).json({ message: "Email verified successfully! You can now login." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = resetPasswordTokenExpiry;
    
    await user.save();
    
    await sendPasswordResetEmail(email, resetToken);
    
    res.status(200).json({ message: "Password reset email sent!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// RESET PASSWORD
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    
    await user.save();
    
    res.status(200).json({ message: "Password reset successfully! You can now login." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// =============================================
// NEW ENDPOINT FOR PROFILE PICTURE UPLOAD
// =============================================

// UPDATE PROFILE PICTURE
router.post("/users/profile-picture", auth, async (req, res) => {
  try {
    const { profilePicture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture },
      { new: true }
    ).select('-password');
    
    res.status(200).json({
      message: "Profile picture updated",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;

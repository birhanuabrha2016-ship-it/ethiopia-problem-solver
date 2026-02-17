const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/question");
const answerRoutes = require("./routes/answer");
const contactRoutes = require("./routes/contact");
const uploadRoutes = require("./routes/upload");

const app = express();

// Direct MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ethiopia_problem_solver")
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.log("MongoDB Connection Error:", err));

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://192.168.137.128:3000',
    'https://ethiopia-problem-solver.netlify.app' // <-- ADD THIS LINE
  ]
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

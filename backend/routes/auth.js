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
    // This sets the user as verified immediately without sending email
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

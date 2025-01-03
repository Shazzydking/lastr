const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;

// User Registration
const userRegister = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: "User  registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

// User Login
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login Request Body:", req.body); // Log the request body

    try {
        const user = await User.findOne({ email });
        console.log("User   Found:", user); // Log the user object
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        console.log("Entered Password:", password); // Log the entered password
        const isPasswordValid = await user.comparePassword(password);
        console.log("Password is valid for the user:", isPasswordValid); // Log the result of the comparison

        if (!isPasswordValid) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ token, name: user.name });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

module.exports = { userRegister, userLogin };
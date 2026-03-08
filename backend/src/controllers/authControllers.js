import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function signUp(req, res) {
    try {
        const { name, email, password } = req.body;

        const normalizedEmail = email.toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name, email: normalizedEmail, password: hashedPassword
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" }
        );

        res.status(201).json({
            token, user: {
                id: newUser._id, name: newUser.name, email: newUser.email
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" }
        );

        res.json({
            token, user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

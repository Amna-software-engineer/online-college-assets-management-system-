import UserModel from "../models/user.model.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "some_random_secret_key_for_access_token";

export const register = async (req, res) => {
    console.log("req.body ", req.body);
    const { name, email, role, department, password } = req.body;
    if (!name || !email || !role || !department || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    try {
        const existingUser = await UserModel.findOne({ email, role })
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await UserModel.create({ name, email, role, department, password: hashedPassword });
        res.json({ success: true, message: "User created successfully", user: newUser });
    } catch (error) {
        console.log("Error in Login Controller", error);
        res.status(500).json({ success: false, message: "Error in Register Controller", error: error.message });
    }
}
export const login = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    try {

        const User = await UserModel.findOne({ email });
        if (!User) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, User.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }
        const token = jwt.sign({ userId: User._id, role: User.role, email: User.email, name: User.name }, JWT_ACCESS_SECRET);
        res.json({ success: true, message: "User logged in successfully", token, user: { name: User.name, email: User.email, role: User.role, department: User.department, userId: User._id } });

    } catch (error) {
        console.log("Error in Login Controller", error);

        res.status(500).json({ success: false, message: "Error in Login Controller", error: error.message });
    }
}

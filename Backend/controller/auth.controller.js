import UserModel from "../models/user.model.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "some_random_secret_key_for_access_token";

export const register = async (req, res) => {
    console.log("req.body ", req.body);
    const { name, email, role, department, password } = req.body;
    if (!name || !email || !role || !department) {
        return res.status(400).json({ success: false, message: "All fields are required" });

    } else if (role !== "Faculty" && !password) {//check password for non-faculty registration
        return res.status(400).json({ success: false, message: "Password is required for non-faculty registration" });
    } else {

        try {
            const existingUser = await UserModel.findOne({ email, role })
            if (existingUser) {
                return res.status(400).json({ success: false, message: "User already exists" });
            }
            const hashedPassword = password && await bcrypt.hash(password, 10)
            const newUser = role !== "Faculty" ? await UserModel.create({ name, email, role, department, password: hashedPassword }) : await UserModel.create({ name, email, role, department });
            res.json({ success: true, message: "User created successfully", user: newUser });
        } catch (error) {
            console.log("Error in Login Controller", error);
            res.status(500).json({ success: false, message: "Error in Register Controller", error: error.message });
        }
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
        const token = jwt.sign({ userId: User._id, role: User.role, email: User.email, name: User.name, department: User.department }, JWT_ACCESS_SECRET);
        res.json({ success: true, message: "User logged in successfully", token, user: { name: User.name, email: User.email, role: User.role, department: User.department, userId: User._id } });

    } catch (error) {
        console.log("Error in Login Controller", error);

        res.status(500).json({ success: false, message: "Error in Login Controller", error: error.message });
    }
}

export const getFaculty = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    console.log('decoded', decoded);

    try {
        let facultyList = [];

        if (decoded.role === "HOD") {
            facultyList = await UserModel.find({ department: decoded.department, role: "Faculty" }).select("-password");
        } else if (decoded.role === "Principal") {
            facultyList = await UserModel.find({ role: "Faculty" }).select("-password");
            console.log("facultyList principal", facultyList);
        }

        res.json({ success: true, message: "Faculty list fetched successfully", facultyList });
    } catch (error) {

        console.log("Error in showFaculty Controller", error);

        res.status(500).json({ success: false, message: "Error in showFaculty Controller", error: error.message });
    }
}
export const deleteFaculty = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedFaculty = await UserModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Faculty deleted successfully", deletedFaculty });
    } catch (error) {

        console.log("Error in showFaculty Controller", error);

        res.status(500).json({ success: false, message: "Error in showFaculty Controller", error: error.message });
    }
}

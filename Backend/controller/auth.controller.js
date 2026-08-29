import UserModel from "../models/user.model.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendResetEmail } from "../utils/sendEmail.js";
import nodemailer from "nodemailer";
dotenv.config();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "some_random_secret_key_for_access_token";

export const register = async (req, res) => {
    console.log("req.body ", req.body);
    const { name, email, role, department, password } = req.body;

    if (!name || !email || !role || !department) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    } else if (role !== "Faculty" && !password) {
        return res.status(400).json({ success: false, message: "Password is required for non-faculty registration" });
    }

    try {
        // Check if user already exists by email and role
        const existingUser = await UserModel.findOne({ email, role });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Determine HOD status
        let status = "Active";
        if (role === "HOD") {
            status = "Blocked";
        }

        const hashedPassword = password && await bcrypt.hash(password, 10);

        // Create new user
        const newUserData = { name, email, role, department };
        if (role !== "Faculty") newUserData.password = hashedPassword;
        newUserData.status = status;

        const newUser = await UserModel.create(newUserData);

        res.json({
            success: true,
            message: `User created successfully ${status === "Blocked" ? " (pending approval)" : ""}`,
            user: {
                name: newUser.name,
                _id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                department: newUser.department,
                status: newUser.status
            }
        });

    } catch (error) {
        console.log("Error in Register Controller", error);
        res.status(500).json({ success: false, message: "Error in Register Controller", error: error.message });
    }
}
export const login = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    try {

        const User = await UserModel.findOne({ email }).populate("department", "name");
        console.log("user ", User);

        if (!User) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, User.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }
        const token = jwt.sign({ userId: User._id, role: User.role, email: User.email, name: User.name, department: User.department }, JWT_ACCESS_SECRET);
        res.json({ success: true, message: "User logged in successfully", token, user: { name: User.name, email: User.email, role: User.role, department: User.department, userId: User._id, status: User.status } });

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
            facultyList = await UserModel.find({ department: decoded.department._id, role: "Faculty" }).select("-password");
        } else if (decoded.role === "Principal") {
            facultyList = await UserModel.find().select("-password");
            console.log("facultyList principal", facultyList);
        }

        res.json({ success: true, message: "Faculty list fetched successfully", facultyList });
    } catch (error) {

        console.log("Error in showFaculty Controller", error);

        res.status(500).json({ success: false, message: "Error in showFaculty Controller", error: error.message });
    }
}
// to delet faculty member
export const deleteFaculty = async (req, res) => {

    const id = req.params.id;
    console.log("delete faculty ", id);
    try {
        const deletedFaculty = await UserModel.findByIdAndDelete(id);
        return res.json({ success: true, message: "Faculty deleted successfully", deletedFaculty });
    } catch (error) {

        console.log("Error in showFaculty Controller", error);

        res.status(500).json({ success: false, message: "Error in showFaculty Controller", error: error.message });
    }
}
// send reset link via email to hod to chnage password and name
export const sendHODSetupEmail = async (req, res) => {
    const { hodId } = req.body;

    try {
        const hod = await UserModel.findById(hodId);

        const token = jwt.sign(
            { userId: hod._id },
            JWT_ACCESS_SECRET,
            { expiresIn: "24h" }
        );

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetLink = `http://localhost:5173/reset-password?token=${token}`;

       const test= await transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.HOD_EMAIL,
            subject: "HOD Account Setup — College Asset System",
            html: `
                <h3>HOD Account Setup</h3>
                <p>Click the link below to set your name and password:</p>
                <a href="${resetLink}">Setup Account</a>
                <p>This link will be valid for 24 hours.</p>
            `
        });
        console.log(test);
        

        res.json({ success: true, message: "Setup email sent to HOD" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { token, name, password } = req.body;
    
    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
        const hashed = await bcrypt.hash(password, 10);
        
        await UserModel.findByIdAndUpdate(decoded.userId, {
            name,
            password: hashed,
        });
        
        res.json({ success: true, message: "Password updated successfully" });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Principal", "HOD", "Faculty"], required: true },
    department: { type: String, required: true }
})

const model = mongoose.model("userModel", userSchema);
export default model;
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    role: { type: String, enum: ["Principal", "HOD", "Faculty"], required: true },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departmentModel",
        required: true
    },
}, { timestamps: true })

const model = mongoose.model("userModel", userSchema);
export default model;
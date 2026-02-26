import mongoose from 'mongoose';
import userModel from './user.model.js'

const requestSchema = new mongoose.Schema({
    RequestorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
        required: true
    },
    department: {
        type: String,
        enum: ["CS", "Maths", "Physics", "Botany"],
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },
    itemName: { type: String, required: true },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true
    },
    quantity: { type: Number, required: true },
    category: {
        type: String,
        enum: ["IT & Electronics", "Furniture", "Stationery", "Lab Equipment", "Others"],
        required: true
    },
    specifications: { type: String },  // Technical Specs
    reason: { type: String }  // Reason for Request (optional)

}, { timestamps: true })

const model = mongoose.model("requestModel", requestSchema);
export default model;
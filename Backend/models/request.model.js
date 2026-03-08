import mongoose from 'mongoose';
import userModel from './user.model.js'
import DepartmentModell from "./department.model.js"

const requestSchema = new mongoose.Schema({
    requestType: {
        type: String,
        enum: ["New Asset", "Maintenance", "Faculty Request"],
        required: true
    },
    email: { type: String },
    RequestorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
        required: true
    },
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: "assetModel" },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DepartmentModel",
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },
    itemName: { type: String, required: true }, //we will use for both asset name and faculty name
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
    },
    quantity: { type: Number },
    category: {
        type: String,
        enum: ["IT & Electronics", "Furniture", "Stationery", "Lab Equipment", "Others", "Networking"],

    },
    specifications: { type: String },  // Technical Specs
    reason: { type: String }  // Reason for Request (optional)

}, { timestamps: true })

const model = mongoose.model("requestModel", requestSchema);
export default model;
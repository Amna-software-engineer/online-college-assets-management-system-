import mongoose from 'mongoose';

const deptSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true, 
        enum: ["IT & Electronics", "Furniture", "Networking", "Electrical", "Lab Equipment"] 
    },
    category: {
        type: String,
        enum: ["IT & Electronics", "Furniture", "Networking", "Electrical", "Lab Equipment"],
        required: true
    },
    hod: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "userModel", 
        required: true }
}, { timestamps: true })

const model = mongoose.model("departmentModel", deptSchema);
export default model;


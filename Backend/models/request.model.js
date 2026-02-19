import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    RequestorName: { type: String, required: true },
    department: { type: String, required: true },
    status: { 
        type: String,
        enum: ["Pending", "Approved", "Rejected"], 
        required: true },
    itemName: { type: Boolean, required: true },
    quantity:{type: Number},
    
})

const model = mongoose.model("requestModel", requestSchema);
export default model;
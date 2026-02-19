import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { 
        type: String,
        enum: ["IT & Electronics", "Furniture", "Networking","Electrical","Lab Equipment"], 
        required: true },
    isBulk: { type: Boolean, required: true },
    assetTag:{ type: String},
    quantity:{type: Number},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: "userSchema"},
    department: { type: String, required: true },
    condition:  { 
        type: String, 
        enum: ["New", "Damaged", "Lost","Maintenance"], 
        required: true }
})

const model = mongoose.model("assetModel", assetSchema);
export default model;
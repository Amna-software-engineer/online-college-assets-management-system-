import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    action: { type: String, 
        // enum: ["Transferred", "Status Changed", "Quantity Added"], 
        required: true }, // e.g., "Transferred", "Status Changed", "Quantity Added"
    user: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" }, // Who got it?
    quantity: { type: Number },
    date: { type: Date, default: Date.now },
    note: { type: String } 
});


const assetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        enum: ["IT & Electronics", "Furniture", "Stationery", "Lab Equipment", "Others"],
        required: true
    },
    price: { type: Number, required: true }, // Price per unit
    quantity: { type: Number },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
    department: { type: String, enum: ["CS", "Maths", "Physics","Botany"],required: true },
    condition: {
        type: String,
        enum: ["New", "Damaged", "Lost", "Maintenance"],
        required: true,
        default: "New"
    },
    status: {
        type: String,
        enum: ["Available", "Assigned", "Pending"],
        default: "Available"
    },
    history: [historySchema]
},{timestamps:true})

const model = mongoose.model("assetModel", assetSchema);
export default model;
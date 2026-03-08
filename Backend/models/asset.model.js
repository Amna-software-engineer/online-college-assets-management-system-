import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    action: { type: String, 
        required: true }, // e.g., "Transfered In", "Transfered Out", "Stock Updated","Initial Purchase"
    user: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" }, // Who got it?
    quantity: { type: Number },
    date: { type: Date, default: Date.now },
    note: { type: String } 
});


const assetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        enum: ["IT & Electronics", "Furniture", "Stationery", "Lab Equipment", "Others", "Networking"],
        required: true
    },
    price: { type: Number, required: true }, // Price per unit
    quantity: { type: Number },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
    department: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "DepartmentModel",
       },
    condition: {
        type: String,
        enum: ["New", "Damaged", "Lost", "Maintenance"],
        required: true,
        default: "New"
    },
    collegeStatus: {
        type: String,
        enum: ["Available", "Assigned", "Pending"],
        default: "Available"  // Principal ke liye status
    },
    deptStatus: {
        type: String,
        enum: ["Available", "Assigned", "Pending"],
        default: "Available"  // HOD/faculty ke liye status
    },
    history: [historySchema]
},{timestamps:true})

const model = mongoose.model("assetModel", assetSchema);
export default model;
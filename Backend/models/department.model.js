import mongoose from 'mongoose';

const deptSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true, 
        enum: ["CS","Botany","Physics","Maths","Chemistry"] 
    },
    hod: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "userModel", 
        }
}, { timestamps: true })

const model = mongoose.model("departmentModel", deptSchema);
export default model;


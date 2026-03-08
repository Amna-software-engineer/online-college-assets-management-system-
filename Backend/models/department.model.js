import mongoose from 'mongoose';

const deptSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true, 
        enum: ["CS","Botany","Physics","Maths","Chemistry","Political Science","Islamyat","Electronics"] 
    },
    hod: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "userModel", 
        }
}, { timestamps: true })

const model = mongoose.model("DepartmentModel", deptSchema);
export default model;


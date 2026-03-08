import mongoose from 'mongoose';

const deptSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ["CS", "Botany", "Physics", "Maths", "Chemistry", "Political Science", "Islamyat", "Electronics", "Pak Study", "Urdu", "Pashto"]
    },
    hod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
    },
    lastAuditDate: { type: Date, default: Date.now },
    auditStatus: {
        type: String,
        enum: ['Verified', 'Pending', 'Requested'],
        default: 'Verified'
    },
    auditHistory: [
        {
            date: Date,
            verifiedBy: String,
            totalItems: Number,
            status: String // e.g., "All Matched" or "Discrepancy Found"
        }
    ]
}, { timestamps: true })

const model = mongoose.model("DepartmentModel", deptSchema);
export default model;


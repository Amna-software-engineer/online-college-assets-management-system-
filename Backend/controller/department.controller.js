import DepartmentModel from "../models/department.model.js"
import UserModel from "../models/user.model.js"

export const getDept = async (req, res) => {
    console.log("get dept");

    try {
        const deptList = await DepartmentModel.find();
        if (deptList) {
            return res.status(201).json({ success: true, message: "Department Fetched successfully!", deptList });
        }
    } catch (error) {
        console.log("Error fetching department: ", error);

        res.status(500).json({ success: false, message: "Error Fetching Department", error: error.message });
    }
};
export const createDept = async (req, res) => {
    const { name, hodId } = req.body
    console.log(req.body);

    try {
        let newDept;
        const exsistingDept = await DepartmentModel.findOne({ name });
        if (exsistingDept) {
            return res.status(400).json({ success: false, message: "Department already exists" });
        } else {
            newDept = await DepartmentModel.create({ name, hodId: hodId || null });
        }
        if (newDept) {
            return res.status(201).json({ success: true, message: "Department created successfully!", newDept });
        }
    } catch (error) {
        console.log("Error creating department:", error);

        res.status(500).json({ success: false, message: "Error creating Department", error: error.message });
    }
};
// will handle hod assign to dept/ and change hod
export const updateDept = async (req, res) => {
    const { hodId } = req.body;
    const deptId = req.params.id;

    try {
        if (!hodId) {
            return res.status(400).json({
                success: false,
                message: "HOD id is required"
            });
        }

        const dept = await DepartmentModel.findByIdAndUpdate(
            deptId,
            { hod: hodId, status: "Active" },
            { new: true }
        );

        const deptHods = await UserModel.find({ department: deptId });

        for (let hod of deptHods) {
            if (hod._id.toString() === hodId) {
                hod.status = "Active";
            } else {
                hod.status = "Blocked";
            }
            await hod.save();
        }

        return res.status(200).json({
            success: true,
            message: "Department Updated successfully!",
            dept
        });

    } catch (error) {
        console.log("Error Updating department:", error);

        res.status(500).json({
            success: false,
            message: "Error Updating Department",
            error: error.message
        });
    }
};


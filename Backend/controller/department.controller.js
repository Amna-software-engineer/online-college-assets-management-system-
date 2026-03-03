import DepartmentMode from "../models/department.model.js"

export const createDept = async (req, res) => {
    const {name,hodId}=req.body
    try {
      const newDept= await DepartmentMode.create({name,hodId});
      if(newDept){
          return res.status(201).json({ success: true, message: "Department created successfully!", newDept });
      } 
    } catch (error) {
        console.log("Error creating department:", error);

        res.status(500).json({ success: false, message: "Error creating request", error: error.message });
    }
};
import requestModel from "../models/request.model.js";
import jwt, { decode } from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "some_random_secret_key_for_access_token";

export const createRequest = async (req, res) => {
    const { RequestorId,department,itemName,quantity, priority } = req.body;
    try {
        if (!RequestorId || !department || !itemName || !quantity || !priority) {   
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }
        const newRequest = await requestModel.create({ RequestorId, department, itemName, quantity, priority });
        if (newRequest) {
            return res.status(201).json({ success: true, message: "Request created successfully!", request: newRequest });
        }   
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating request", error: error.message });
    }   
};

export const getRequests = async (req, res) => {
       const authHeader = req.headers.authorization;
       const token = authHeader && authHeader.split(" ")[1];
       const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
       console.log('decoded req',decoded);
   
       try {
           let requestList=[];
           // enum: ["CS", "Maths", "Physics"]
           
           if (decoded.role === "HOD") {      
                requestList = await requestModel.find({ department: decoded.department }).populate("RequestorId", "name");
             console.log("hod req",requestList);
           }else if(decoded.role === "Principal"){
                requestList = await requestModel.find().populate("RequestorId", "name");
                 console.log("Principal req",requestList);
           }                          
        console.log(requestList);
        
     return res.status(200).json({ success: true, requestList });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching requests", error: error.message });
    }   
};
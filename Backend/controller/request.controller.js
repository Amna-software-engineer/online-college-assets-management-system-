import requestModel from "../models/request.model.js";
import jwt, { decode } from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "some_random_secret_key_for_access_token";

export const createRequest = async (req, res) => {
    console.log("req.body", req.body);

    const { RequestorId, department, itemName, quantity, category, priority, specifications, reason, requestType, assetId, email } = req.body;

    try {
        if (!requestType) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }
        if ( requestType === "New Asset" || requestType === "Maintenance") {
            if (!RequestorId || !department || !itemName || !quantity || !priority || !category || !specifications ) {
                return res.status(400).json({ success: false, message: "All fields are required!" });
            }
        }
        let newRequest;
        if (requestType === "Faculty Request") { // for faculty
            if (!RequestorId || !department || !itemName || !email || !requestType  ) {
                return res.status(400).json({ success: false, message: "All fields are required!" });
            }
            newRequest = await requestModel.create({ requestType, RequestorId, department, itemName, email });
        }
        newRequest = await requestModel.create({ RequestorId, department, itemName, quantity, priority, category, specifications, reason: reason || "", requestType, assetId: assetId || null });
        console.log(newRequest);

        if (newRequest) {
            return res.status(201).json({ success: true, message: "Request created successfully!", request: newRequest });
        }
    } catch (error) {
        console.log("Error creating request:", error);

        res.status(500).json({ success: false, message: "Error creating request", error: error.message });
    }
};

export const getRequests = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    console.log('decoded req', decoded);

    try {
        let requestList = [];
        // enum: ["CS", "Maths", "Physics"]

        if (decoded.role === "HOD") {
            requestList = await requestModel.find({ department: decoded.department }).populate("RequestorId", "name");
            console.log("hod req", requestList);
        } else if (decoded.role === "Principal") {
            requestList = await requestModel.find().populate("RequestorId", "name");
            console.log("Principal req", requestList);
        }
        console.log(requestList);

        return res.status(200).json({ success: true, requestList });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching requests", error: error.message });
    }
};
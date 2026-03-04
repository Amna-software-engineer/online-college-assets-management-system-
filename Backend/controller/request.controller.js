import requestModel from "../models/request.model.js";
import jwt, { decode } from "jsonwebtoken";
import mongoose from "mongoose";

import dotenv from "dotenv";
import bcrypt from "bcryptjs";


dotenv.config();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "some_random_secret_key_for_access_token";

export const createRequest = async (req, res) => {
    console.log("req.body", req.body);
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    const { department, itemName, quantity, category, priority, specifications, reason, requestType, assetId, email } = req.body;

    const RequestorId = decoded.userId;

    try {
        if (!requestType) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }
        if (requestType === "New Asset" || requestType === "Maintenance") {
            if (!RequestorId || !department || !itemName || !quantity || !priority || !category || !specifications) {
                return res.status(400).json({ success: false, message: "All fields are required!" });
            }
        }
        let newRequest;
        if (requestType === "Faculty Request") { // for faculty
            if (!RequestorId || !department || !itemName || !email || !requestType) {
                return res.status(400).json({ success: false, message: "All fields are required!" });
            }
            newRequest = await requestModel.create({ requestType, RequestorId, department, itemName, email });
        } else {
            console.log(newRequest);
            newRequest = await requestModel.create({ RequestorId, department, itemName, quantity, priority, category, specifications, reason: reason || "", requestType, assetId: assetId || null });
        }

        if (newRequest) {
            return res.status(201).json({ success: true, message: "Request created successfully!", request: newRequest });
        }
    } catch (error) {
        console.log("Error creating request:", error);

        res.status(500).json({ success: false, message: "Error creating request", error: error.message });
    }
};
export const updateRequest = async (req, res) => {
    const requestId = req.params.id;

    try {
        const { itemName, quantity, priority, category, specifications, reason } = req.body;

        const updatedRequest = await requestModel.findByIdAndUpdate(requestId, { itemName, quantity, priority, category, specifications, reason }, { new: true });

        if (updatedRequest) {
            return res.status(201).json({ success: true, message: "Request updated successfully!", request: updatedRequest });
        }
    } catch (error) {
        console.log("Error updating request:", error);

        res.status(500).json({ success: false, message: "Error updating request", error: error.message });
    }
};

export const getRequests = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    try {
        let requestList = [];
        
        if (decoded.role === "HOD") {
            let dptID = decoded.department._id
            requestList = await requestModel.find({ department: dptID }).populate("RequestorId", "name");
        } else if (decoded.role === "Principal") {
            requestList = await requestModel.find().populate("RequestorId", "name");
        }
        return res.status(200).json({ success: true, requestList });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching requests", error: error.message });
    }
};
// to delete faculty request
export const deleteFaculty = async (req, res) => {

    const id = req.params.id;
    console.log("delete request ", id);
    try {
        const deletedRequest = await requestModel.findByIdAndDelete(id);

        console.log(deletedRequest);
        if (deletedRequest) {
            return res.json({ success: true, message: "Request deleted successfully", deletedRequest });
        }
    } catch (error) {

        console.log("Error in delete request Controller", error);

        res.status(500).json({ success: false, message: "Error in delete request Controller", error: error.message });
    }
}

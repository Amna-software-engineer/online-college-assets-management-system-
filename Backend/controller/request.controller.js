import requestModel from "../models/request.model.js";
import assetModel from "../models/asset.model.js";
import UserModel from "../models/user.model.js";
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
// handle request edit
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
// handle status updation and action based on type of request
// export const updateReqStatus = async (req, res) => {
//     const requestId = req.params.id;
//     const { status } = req.body;

//     try {
//         const request = await requestModel.findById(requestId).populate("RequestorId department");
//         if (!request) return res.status(404).json({ success: false, message: "Request not found" });

//         if (status === "Rejected") {
//             // findByIdAndUpdate direct status change karega bina baqi fields ko disturb kiye
//             await requestModel.findByIdAndUpdate(requestId,
//                 { status: "Rejected" }
//                 // Validation bypass karne ke liye
//             );

//             return res.status(200).json({
//                 success: true,
//                 message: "Request has been rejected successfully."
//             });
//         }
//         if (status === "Approved") {
//             // --- 1. NEW ASSET LOGIC ---
//             if (request.requestType === "New Asset") {
//                 const stockAsset = await assetModel.findOne({ name: request.itemName, collegeStatus: "Available" });

//                 if (!stockAsset || stockAsset.quantity < request.quantity) {
//                     return res.status(400).json({ success: false, message: "Insufficient stock" });
//                 }

//                 // Main Stock Update + History
//                 stockAsset.quantity -= request.quantity;
//                 stockAsset.history.push({
//                     action: "Transfered Out",
//                     user: request.RequestorId?._id,
//                     quantity: request.quantity,
//                     note: `Transferred to ${request.department?.name || 'Department'}`
//                 });
//                 if (stockAsset.quantity === 0) stockAsset.collegeStatus = "Assigned";
//                 await stockAsset.save();

//                 // Create Dept Asset + History
//                 await assetModel.create({
//                     name: request.itemName,
//                     quantity: request.quantity,
//                     department: request.department?._id,
//                     category: stockAsset.category,
//                     price: stockAsset.price,
//                     condition: "New",
//                     collegeStatus: "Assigned",
//                     deptStatus: "Available",
//                     history: [{
//                         action: "Transfered In",
//                         user: request.RequestorId?._id,
//                         quantity: request.quantity,
//                         note: "Received from Main College Stock"
//                     }]
//                 });
//             }

//             // --- 2. MAINTENANCE / DAMAGE / LOST LOGIC ---
//             else if (request.requestType === "Maintenance") {
//                 const targetAsset = await assetModel.findById(request.assetId);
//                 if (!targetAsset) return res.status(404).json({ success: false, message: "Asset not found" });

//                 const reasonText = request.reason?.toUpperCase() || "";
//                 const isLost = reasonText.includes("LOST");
//                 const actionType = isLost ? "Lost" : "Maintenance";

//                 // Update original asset history
//                 targetAsset.quantity -= request.quantity;
//                 targetAsset.history.push({
//                     action: "Stock Updated",
//                     user: request.RequestorId?._id,
//                     quantity: request.quantity,
//                     note: `Asset marked as ${actionType}. Reason: ${request.reason}`
//                 });
//                 await targetAsset.save();

//                 // Create Entry for the Damaged/Lost item to keep track of broken stock
//                 await assetModel.create({
//                     name: targetAsset.name,
//                     quantity: request.quantity,
//                     department: targetAsset.department,
//                     category: targetAsset.category,
//                     price: targetAsset.price,
//                     condition: isLost ? "Lost" : "Damaged",
//                     collegeStatus: "Assigned",
//                     deptStatus: "Pending", // Admin will decide what to do with this
//                     history: [{
//                         action: "Initial Purchase", // Log as broken entry
//                         user: request.RequestorId?._id,
//                         quantity: request.quantity,
//                         note: `Separated from main dept stock due to ${actionType}`
//                     }]
//                 });
//             }

//             await requestModel.findByIdAndUpdate(requestId, { status: "Approved" });
//             return res.status(200).json({ success: true, message: "Request approved and history updated" });
//         }
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

export const updateReqStatus = async (req, res) => {
    const requestId = req.params.id;
    const { status } = req.body;

    try {
        if (status === "Rejected") {
            const updatedReq = await requestModel.findByIdAndUpdate(requestId, { status });
            return res.status(200).json({
                success: true,
                message: "Request has been rejected successfully.",
                updatedReq
            });

        }
        if (status === "Approved") {
            const request = await requestModel.findById(requestId).populate("department");
            console.log("request", request);

            // 1. Faculty
            if (request.requestType === "Faculty Request") {
                const { itemName: name, department, email } = request;
                const existingUser = await UserModel.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ success: false, message: "User already exists" });
                }

                const newFaculty = await UserModel.create({ name, email, role: "Faculty", department, status: "Active" });
                const updatedReq = await requestModel.findByIdAndUpdate(requestId, { status })
                return res.status(200).json({
                    success: true,
                    message: `${request.requestType} processed and approved successfully.`, newFaculty, updatedReq
                });
               
            } else if (request.requestType === "New Asset") { // 2. Request For New Asset
                const stockAsset = await assetModel.findOne({ name: request.itemName.trim(), collegeStatus: "Available" })
                console.log("stockAsset", stockAsset);

                if (!stockAsset || stockAsset.quantity < request.quantity) {
                    return res.status(400).json({
                        success: false,
                        message: `Insufficient stock. Available: ${stockAsset ? stockAsset.quantity : 0}`
                    });
                } else if (stockAsset.quantity >= request.quantity) {
                    // 1. update clg stock
                    stockAsset.quantity -= request.quantity;
                    if (stockAsset.quantity === request.quantity) {
                        stockAsset.collegeStatus = "Assigned";
                    }
                    stockAsset.deptStatus = "Available";
                    stockAsset.history.push({
                        action: "Transfer Out",
                        quantity: request.quantity,
                        note: `Transferred ${request.quantity} units to ${request.department.name} department.`,
                        date: new Date()
                    });


                    // 2. create new asset 
                    const transferedAsset = await assetModel.create({
                        name: request.itemName,
                        category: request.category,
                        price: stockAsset.price,
                        quantity: Number(request.quantity),
                        assignedTo: null,
                        department: request.department,
                        condition: stockAsset.condition,
                        collegeStatus: "Assigned",
                        deptStatus: "Available",
                        history: [{
                            action: "Transfer In",
                            quantity: request.quantity,
                            note: "Asset received from college stock",
                            date: new Date()
                        }]
                    });
                    const updatedStockAsset = await stockAsset.save();
                    console.log("updatedStockAsset", updatedStockAsset);
                    const updatedReq = await requestModel.findByIdAndUpdate(requestId, { status: "Approved" })
                    return res.status(200).json({
                        success: true,
                        message: `${request.requestType} processed and approved successfully.`, updatedReq, transferedAsset
                    });
                }

            } else if (request.requestType === "Maintenance") {  // 3. Lost/Damaged Asset req

                const reason = request.reason?.toLowerCase();

                if (!reason.includes("lost") && !reason.includes("damaged")) {
                    return res.status(400).json({
                        success: false,
                        message: "Reason must specify LOST or DAMAGED."
                    });
                }

                const deptAsset = await assetModel.findOne({
                    name: request.itemName.trim(),
                    department: request.department._id,
                });

                if (!deptAsset || deptAsset.quantity < request.quantity) {
                    return res.status(400).json({
                        success: false,
                        message: `Insufficient department assets. Available: ${deptAsset ? deptAsset.quantity : 0}`
                    });
                }

                // 1. update department asset quantity
                deptAsset.quantity -= request.quantity;

                deptAsset.history.push({
                    action: reason.includes("lost") ? "Marked Lost" : "Marked Damaged",
                    quantity: request.quantity,
                    note: `${request.quantity} unit marked ${reason.includes("lost") ? "LOST" : "DAMAGED"} by ${request.department.name} department.`,
                    date: new Date()
                });

                if (deptAsset.quantity === 0) {
                    deptAsset.deptStatus = "Assigned";
                }

                // 2. create new entry for lost/damaged asset
                const damagedAsset = await assetModel.create({
                    name: request.itemName,
                    category: deptAsset.category,
                    price: deptAsset.price,
                    quantity: request.quantity,
                    assignedTo: null,
                    department: request.department,
                    condition: reason.includes("lost") ? "Lost" : "Maintenance",
                    collegeStatus: "Assigned",
                    deptStatus: "Maintenance",
                    history: [{
                        action: "Maintenance Entry",
                        quantity: request.quantity,
                        note: `Asset marked ${reason.includes("lost") ? "LOST" : "DAMAGED"} from department stock.`,
                        date: new Date()
                    }]
                });

                const updatedDeptAsset = await deptAsset.save();

                const updatedReq = await requestModel.findByIdAndUpdate(requestId, { status: "Approved" });

                return res.status(200).json({
                    success: true,
                    message: `${reason.includes("lost") ? "Lost" : "Damaged"} asset processed successfully.`,
                    updatedReq,
                    damagedAsset,
                    updatedDeptAsset
                });
            }



        }
    } catch (error) {
        console.log(error);

        res.status(500).json({ success: false, message: error.message });
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
            requestList = await requestModel.find({ department: dptID }).populate("RequestorId", "name").populate("department", "name");
        } else if (decoded.role === "Principal") {
            requestList = await requestModel.find().populate("RequestorId", "name").populate("department", "name");
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

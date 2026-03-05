import assetModel from "../models/asset.model.js";
import jwt, { decode } from "jsonwebtoken";
import userModel from '../models/user.model.js'

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "some_random_secret_key_for_access_token";



export const createAsset = async (req, res) => {
    let { name, category, price, quantity, assignedTo, department, condition } = req.body;
    console.log(req.body);

    try {
        if (!name || !category || !price || !quantity || !condition) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }


        // 1. Check if same asset exists in Main Store (assignedTo: null)
        let existingAsset = await assetModel.findOne({
            name,
            condition,
            department,
            assignedTo: null
        });

        if (existingAsset) {
            existingAsset.quantity += Number(quantity);

            existingAsset.history.push({
                action: "Stock Updated",
                quantity: Number(quantity),
                note: `Additional ${quantity} units added to stock by Principal.`,
                date: new Date()
            });

            await existingAsset.save();
            return res.status(200).json({
                success: true,
                message: "Stock updated for existing asset!",
                asset: existingAsset
            });
        }

        // 2. Create New Asset if it doesn't exist
        const newAsset = await assetModel.create({
            name,
            category,
            price,
            quantity: Number(quantity),
            assignedTo: assignedTo || null,
            department: department || null,
            condition,
            collegeStatus: department && !assignedTo ? "Assigned" : "Available", // if assigned to dept
            deptStatus: assignedTo ? "Assigned" : "Available", // if assigned to faculty
            history: [{
                action: "Initial Purchase",
                quantity: Number(quantity),
                note: assignedTo
                    ? `Asset created and directly assigned.`
                    : `Initial stock added to Main Store by Principal.`,
                date: new Date()
            }]
        });

        return res.status(201).json({
            success: true,
            message: "Asset created successfully!",
            asset: newAsset
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating asset", error: error.message });
    }
};
// transfer asset from one faculty to another or from store to faculty
export const updateAsset = async (req, res) => {
    const { assetId, quantity, assignedTo, condition, department } = req.body;

    // 1. Validation
    if (!assetId || !quantity || !condition) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    try {
        const originalAsset = await assetModel.findById(assetId).populate('assignedTo');

        if (!originalAsset) {
            return res.status(404).json({ success: false, message: "Asset not found!" });
        }

        // 2.  Check Quantity available 
        if (originalAsset.quantity < quantity) {
            return res.status(400).json({ success: false, message: "Not enough quantity in stock!" });
        }

        // 3. Update Original Asset (The Source)
        // decrease qunatity and update history 
        originalAsset.quantity -= quantity;
        originalAsset.history.push({
            action: "Transfer Out",
            quantity: quantity,
            note: `Transferred ${quantity} units to new custodian.`,
            date: new Date()
        });
        await originalAsset.save();

        // 4. Create/Update Transferred Asset (The Destination)
        // destination asset
        const newAssetData = {
            name: originalAsset.name,
            category: originalAsset.category,
            price: originalAsset.price,
            quantity,
            condition,
            history: [{
                action: "Transfer In",
                quantity,
                note: "Asset received",
                date: new Date()
            }]
        };
        if (assignedTo) {
            newAssetData.assignedTo = assignedTo;
            newAssetData.department = originalAsset.department;
              newAssetData.deptStatus = "Assigned"; //faculty assignment
        }

        if (department) {
            newAssetData.department = department;
             newAssetData.collegeStatus = "Assigned"; //department assignment
        }

        const transferredAsset = await assetModel.create(newAssetData);


        return res.status(201).json({
            success: true,
            message: "Asset Transferred Successfully!",
            transferredAsset,
        });

    } catch (error) {
        console.error("Transfer Error:", error);
        res.status(500).json({ success: false, message: "Error during transfer", error: error.message });
    }
};

export const getAssets = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    console.log('decoded', decoded);

    try {
        let assetList = [];
        // enum: ["CS", "Maths", "Physics"]

        if (decoded.role === "HOD") {
            assetList = await assetModel.find({ department: decoded.department._id }).populate("assignedTo", "name email");
            assetList = assetList.filter(asset => asset.quantity > 0); // HOD ko apne assigned assets nahi dikhane
            console.log("assetList hod", assetList);
        } else if (decoded.role === "Principal") {
            assetList = await assetModel.find().populate("assignedTo", "name email").populate("department");
            console.log("assetList principal", assetList);
        }
        console.log("assetList", assetList);

        res.status(200).json({ success: true, message: "Assets fetched successfully!", assetList });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching assets", error: error.message });
    }
}


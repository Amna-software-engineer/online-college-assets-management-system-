import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./router/auth.router.js";
import assetRouter from "./router/asset.router.js";
import requestRouter from "./router/request.router.js";
import deptRouter from "./router/department.router.js";
import { verifyToken } from "./middleware/auth.middleware.js"

dotenv.config();
const app = express();
const PORT = 5000;
const mongoDbURL = process.env.mongoDbURL;
app.use(cors({
    origin: "https://online-college-assets-management-sy-tau.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

}));
app.use(express.json());   // Middleware to parse JSON bodies



app.use("/api", deptRouter);
app.use("/api", authRouter);
app.use("/api", verifyToken, assetRouter);
app.use("/api", verifyToken, requestRouter);
console.log("mongoDbURL",mongoDbURL);


const ConnectDb = async () => {
    try {
        const connection = await mongoose.connect(
            mongoDbURL,
        );

        if (connection.connection) {
            console.log("Database Connected Successfully!");
        }
    } catch (error) {
        console.log("Something went wronge while connecting DB");
    }
};
await ConnectDb();
export default app;




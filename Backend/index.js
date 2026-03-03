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
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

}));
app.use(express.json());   // Middleware to parse JSON bodies


app.get("/", (req, res) => {
    res.send("Hello World")
});
app.use("/api", authRouter);
app.use("/api", verifyToken, assetRouter);
app.use("/api", verifyToken, requestRouter);
app.use("/api", verifyToken, deptRouter);

mongoose.connect(mongoDbURL,)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        console.log("Connected to Atlas MongoDB Successfully! 🚀");
    })
    .catch((err) => {
        console.error("Message:", err.message);
    });
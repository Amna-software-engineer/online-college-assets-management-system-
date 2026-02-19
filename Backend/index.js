import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./router/auth.router.js";
dotenv.config();
const app = express();
const PORT = 5000;
const mongoDbURL = process.env.mongoDbURL;
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT","PATCH", "DELETE"],

}));
app.use(express.json());   // Middleware to parse JSON bodies


app.get("/", (req, res) => {
    res.send("Hello World")
});
app.use("/api/auth",authRouter);

mongoose.connect(mongoDbURL).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});
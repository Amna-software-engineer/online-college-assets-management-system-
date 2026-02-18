import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 5000;
const mongoDbURL = process.env.mongoDbURL;
app.use(cors());
app.use(express.json());   
console.log(mongoDbURL);

app.get("/", (req, res) => {
    res.send("Hello World")
});

mongoose.connect(mongoDbURL).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});
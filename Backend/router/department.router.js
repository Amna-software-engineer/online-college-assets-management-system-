import Router from "express";
import { createDept, getDept, updateDept } from "../controller/department.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/department",verifyToken, createDept);
router.patch("/department/:id", verifyToken ,updateDept);
router.get("/department", getDept);


export default router;
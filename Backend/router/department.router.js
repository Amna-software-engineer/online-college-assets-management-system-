import Router from "express";
import { createDept, getDept, requestAudit, updateDept, verifyAudit } from "../controller/department.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/department", getDept);
router.post("/department",verifyToken, createDept);
router.patch("/department/:id", verifyToken ,updateDept);
router.patch("/department/request-audit/:deptId", verifyToken ,requestAudit);
router.patch("/department/verify-audit/:deptId", verifyToken ,verifyAudit);


export default router;
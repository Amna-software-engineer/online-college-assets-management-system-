import Router from "express";
import { createDept, getDept } from "../controller/department.controller.js";

const router = Router();

router.post("/department", createDept);
router.get("/department", getDept);


export default router;
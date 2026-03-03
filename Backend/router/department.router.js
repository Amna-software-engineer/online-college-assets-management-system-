import Router from "express";
import { createDept } from "../controller/department.controller.js";

const router = Router();

router.post("/department", createDept);


export default router;
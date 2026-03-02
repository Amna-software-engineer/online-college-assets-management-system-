import Router from "express";
import { login, register, getFaculty } from "../controller/auth.controller.js";
const router = Router();

router.post("/auth/login", login);
router.post("/auth/register", register);
router.post("/faculty",register)
router.get("/faculty",getFaculty )
// router.delete("/faculty/:id",deleteFaculty )

export default router;
import Router from "express";
import { login, register, getFaculty } from "../controller/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/auth/login", login);
router.post("/auth/register", register);
router.post("/faculty",verifyToken,register)
router.get("/faculty",verifyToken,getFaculty )
// router.delete("/faculty/:id",deleteFaculty )

export default router;
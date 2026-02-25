import Router from "express";
import { createRequest, getRequests } from "../controller/request.controller.js";

const router = Router();

router.post("/request", createRequest);
router.get("/request", getRequests);

export default router;
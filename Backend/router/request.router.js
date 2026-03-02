import Router from "express";
import { createRequest, getRequests, updateRequest } from "../controller/request.controller.js";

const router = Router();

router.post("/request", createRequest);
router.get("/request", getRequests);
router.patch("/request/:id", updateRequest);

export default router;
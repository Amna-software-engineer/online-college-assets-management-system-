import Router from "express";
import { createRequest, deleteFaculty, getRequests, updateRequest } from "../controller/request.controller.js";

const router = Router();

router.post("/request", createRequest);
router.get("/request", getRequests);
router.patch("/request/:id", updateRequest);
router.delete("/request/:id", deleteFaculty);


export default router;
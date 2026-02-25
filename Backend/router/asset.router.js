import Router from "express";
import { createAsset, getAssets, updateAsset } from "../controller/asset.controller.js";
const router = Router();

router.post("/asset", createAsset);
router.patch("/asset", updateAsset); //handel transfer of asset
router.get("/asset", getAssets);

export default router;
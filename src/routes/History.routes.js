import { Router } from "express";
import { Authentication } from "../middleware/Authentication.js";
import { CreateHistory, DeleteAllHistory, DeleteOneHistory, GetHistory } from "../controller/History.controller.js";


const router = Router();

router.route("/create-history").post(Authentication,CreateHistory);
router.route("/get-history").get(Authentication,GetHistory);
router.route("/delete-one-history/:id").delete(Authentication,DeleteOneHistory);
router.route("/delete-all-history").delete(Authentication,DeleteAllHistory);



export default router;
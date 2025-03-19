import {Router} from "express";
// local imports
import { Authentication } from "../middleware/Authentication.js";
import { NotificationValidater } from "../Helpers/helper.validate.js";
import { CreateNotification, GetNotification, ReadNotification } from "../controller/Notification.controller.js";

const router = Router();


router.route("/create-notification").post(Authentication,NotificationValidater,CreateNotification);
router.route("/get-notification").get(Authentication,GetNotification);
router.route("/read-notification").patch(Authentication,ReadNotification);




export default router;
import { Router } from 'express';
import { ChangeUserPassword, CreateUser, ForgetPassword, LogedInUser, LoginUser, LogoutUser, ResetPasswordPage, ResetUserPassword, VerifyUser } from '../controller/User.controller.js';
import { CheckLoginData, CheckRegisterData } from '../Helpers/helper.validate.js';
import { Authentication } from '../middleware/Authentication.js';

const router = Router();
router.route('/create-user').post(CheckRegisterData, CreateUser);
router.route('/login-user').post(CheckLoginData, LoginUser);
router.route('/logout-user').post(Authentication, LogoutUser);
router.route('/loged-in-user').get(Authentication, LogedInUser);
router.route('/verify-user/:token').get(VerifyUser);
router.route('/change-password').post(Authentication, ChangeUserPassword);
router.route("/forget-password").post(ForgetPassword);
router.route("/reset-password-page").get(ResetPasswordPage);
router.route("/reset-password").post(ResetUserPassword);

export default router;

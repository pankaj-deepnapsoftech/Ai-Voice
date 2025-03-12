import { Router } from 'express';
import { CreateUser, LogedInUser, LoginUser, LogoutUser, VerifyUser } from '../controller/User.controller.js';
import { CheckLoginData, CheckRegisterData } from '../Helpers/helper.validate.js';
import { Authentication } from '../middleware/Authentication.js';

const router = Router();
router.route('/create-user').post(CheckRegisterData, CreateUser);
router.route('/login-user').post(CheckLoginData, LoginUser);
router.route('/logout-user').post(Authentication,LogoutUser);
router.route('/loged-in-user').get(Authentication, LogedInUser);
router.route('/verify-user/:token').get(VerifyUser);

export default router;

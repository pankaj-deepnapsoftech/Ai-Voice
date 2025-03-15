import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
// local imports
import { UserModel } from '../model/User.model.js';
import { AsyncHandler } from '../utils/AsyncHandler.js';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/customError.js';
import { GenerateToken, verifyToken } from '../utils/Tokes.js';
import { config } from '../config/env.config.js';
import { sendMail } from '../utils/Sendmails.js';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/Logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const accessOption = { httpOnly: true, sameSite: 'none', secure: config.NODE_ENV !== 'development', maxAge: 1000 * 60 * 60 * 24 * 1 };
const refreshOption = { httpOnly: true, sameSite: 'none', secure: config.NODE_ENV !== 'development', maxAge: 1000 * 60 * 60 * 24 * 1.5 };

export const CreateUser = AsyncHandler(async (req, res) => {
  const data = req.body;

  const exist = await UserModel.findOne({ email: data.email });
  if (exist) {
    throw new BadRequestError('User Already Exist', 'CreateUser method');
  }

  const refreshToken = GenerateToken({ email: data.email });

  const user = await UserModel.create({ ...data, refresh_token: refreshToken });
  const accesstoken = GenerateToken({ id: user._id, email: user.email });
  sendMail(
    'emailVerification.ejs',
    { verificationUrl: `http://localhost:5000/api/v1/user/verify-user/${accesstoken}`, name: user.name },
    { subject: 'Verify Your Email', email: user.email },
  );

  res.cookie('ajt', accesstoken, accessOption).cookie('rjt', refreshToken, refreshOption);
  return res.status(StatusCodes.CREATED).json({ message: 'User Register Successful', user, accesstoken, refreshToken });
});

export const LoginUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new BadRequestError('User Not Found', 'LoginUser method');
  }
  const isCorrect = bcrypt.compareSync(password, user.password);
  if (!isCorrect) {
    throw new BadRequestError('Invalid Password', 'LoginUser method');
  }

  if (!user.email_verify) {
    throw new UnauthorizedError('Email Not Verified', 'LoginUser Method');
  }

  const accesstoken = GenerateToken({ id: user._id, email: user.email });
  const refreshToken = GenerateToken({ id: user._id, email: user.email });
  if (!user.email_verify) {
    sendMail(
      'emailVerification.ejs',
      { verificationUrl: `http://localhost:5000/api/v1/user/verify-user/${accesstoken}`, name: user.name },
      { subject: 'Verify Your Email', email: user.email },
    );
  }
  await UserModel.findByIdAndUpdate(user._id, { refresh_token: refreshToken });
  res.cookie('ajt', accesstoken, accessOption).cookie('rjt', refreshToken, refreshOption);
  return res.status(StatusCodes.OK).json({ message: 'Login Successful', user, accesstoken, refreshToken });
});

export const LogoutUser = AsyncHandler(async (_req, res) => {
  res.clearCookie('ajt').clearCookie('rjt');
  return res.status(StatusCodes.OK).json({ message: 'Logout Successful' });
});

export const LogedInUser = AsyncHandler(async (req, res) => {
  const user = req.currectUser;
  return res.status(StatusCodes.OK).json({ user });
});

export const VerifyUser = AsyncHandler(async (req, res) => {
  const { token } = req.params;
  const { email } = verifyToken(token);
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new BadRequestError('User Not Found', 'VerifyUser method');
  }
  await UserModel.findByIdAndUpdate(user._id, { email_verify: true });
  res.redirect(`${config.NODE_ENV !== 'development' ? config.CLIENT_URL : config.LOCAL_CLIENT_URL}`);
});

export const ChangeUserPassword = AsyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await UserModel.findById(req.currectUser?._id);
  if (!user) {
    throw new NotFoundError('User not Found', 'ChangeUserPassword method');
  }

  const isCorrect = bcrypt.compareSync(oldPassword, user.password);
  if (!isCorrect) {
    throw new BadRequestError('Invalid Password', 'LoginUser method');
  }

  await UserModel.findByIdAndUpdate(user._id, { password: newPassword });

  return res.status(StatusCodes.OK).json({
    message: 'Password Updated successful',
  });
});

export const ForgetPassword = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NotFoundError('User not found', 'ForgetPassword Method');
  }

  const token = GenerateToken({ email: user.email }, '10m');

  sendMail(
    'resetPassword.ejs',
    { resetLink: `http://localhost:5000/api/v1/user/reset-password-page?token=${token}`, userName: user.name },
    { subject: 'Reset Password Link', email: user.email },
  );

  return res.status(StatusCodes.OK).json({
    message: 'Reset Password Link Send In your mail',
  });
});

export const ResetPasswordPage = AsyncHandler(async (req, res) => {
  const { token } = req.query;
  const { email } = verifyToken(token);

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NotFoundError('user not found', 'ResetPasswordPage method');
  }

  const fileUrl = path.join(__dirname, '../../index.html');
  return res.sendFile(fileUrl);
});

export const ResetUserPassword = AsyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.query;
  const { email } = verifyToken(token);
  const user = await UserModel.findOne({ email });
  logger.info(user);
  if (!user) {
    throw new NotFoundError('user not found', 'ResetPasswordPage method');
  }

  await UserModel.findByIdAndUpdate(user._id, { password });
  return res.status(StatusCodes.OK).json({
    message: 'Password Reset Successful',
    redirectUrl: config.NODE_ENV !== 'development' ? config.CLIENT_URL : config.LOCAL_CLIENT_URL,
  });
});

export const getAllUser = AsyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const pages = parseInt(page) || 1;
  const limits = parseInt(limit) || 10;
  const skip = (pages - 1) * limits;
  const data = await UserModel.find({}).select("-password -refresh_token").sort({ _id: -1 }).skip(skip).limit(limits);
  return res.status(StatusCodes.OK).json({
    data,
  });
});

import bcrypt from 'bcrypt';

// local imports
import { UserModel } from '../model/User.model.js';
import { AsyncHandler } from '../utils/AsyncHandler.js';
import { BadRequestError } from '../utils/customError.js';
import { GenerateToken, verifyToken } from '../utils/Tokes.js';
import { config } from '../config/env.config.js';

const accessOption = { httpOnly: true, sameSite: 'none', secure: config.NODE_ENV !== 'development', maxAge: 1000 * 60 * 60 * 24 * 1 };
const refreshOption = { httpOnly: true, sameSite: 'none', secure: config.NODE_ENV !== 'development', maxAge: 1000 * 60 * 60 * 24 * 1.5 };

export const CreateUser = AsyncHandler(async (req, res) => {
  const data = req.body;

  const exist = await UserModel.findOne({ email: data.email });
  if (exist) {
    throw new BadRequestError('User Already Exist', 'CreateUser method');
  }

  const refreshToken = GenerateToken({ email: data.email });

  const user = await UserModel.create({ ...data,  refresh_token: refreshToken });
  const accesstoken = GenerateToken({ id: user._id, email: user.email });

  res.cookie('ajt', accesstoken, accessOption).cookie('rjt', refreshToken, refreshOption);
  return res.status(201).json({ message: 'User Register Successful', user, accesstoken, refreshToken });
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
  const accesstoken = GenerateToken({ id: user._id, email: user.email });
  const refreshToken = GenerateToken({ id: user._id, email: user.email });
  await UserModel.findByIdAndUpdate(user._id, { refresh_token: refreshToken });
  res.cookie('ajt', accesstoken, accessOption).cookie('rjt', refreshToken, refreshOption);
  return res.status(200).json({ message: 'Login Successful', user, accesstoken });
});

export const LogoutUser = AsyncHandler(async (_req, res) => {
  res.clearCookie('ajt').clearCookie('rjt');
  return res.status(200).json({ message: 'Logout Successful' });
});

export const LogedInUser = AsyncHandler(async (req, res) => {
  const user = req.currectUser;
  return res.status(200).json({ user });
});

export const VerifyUser = AsyncHandler(async (req, res) => {
  const {token} = req.params;
  const {email} = verifyToken(token);
  const user = await UserModel.findOne({email});
  if(!user){
    throw new BadRequestError('User Not Found', 'VerifyUser method');
  }
  await UserModel.findByIdAndUpdate(user._id, {email_verify: true}); 
  res.redirect(`${config.CLIENT_URL}`);
});



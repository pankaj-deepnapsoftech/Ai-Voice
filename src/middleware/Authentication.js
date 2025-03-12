import { UserModel } from "../model/User.model.js";
import { logger } from "../utils/Logger.js";
import { verifyToken } from "../utils/Tokes.js";

export const Authentication = async (req,res,next) => {
  try {
    const token = req.cookies;
    if (!token.ajt) {
      return res.status(401).json({ message: 'Token is required' });
    }
    const {email} = verifyToken(token.ajt);

    const user = await UserModel.findOne({email}).select('-password -otp -otp_expire -refresh_token');
    req.currectUser = user;
    next();
  } catch (error) {
    logger.error(error);
    return res.status(401).json({ message: 'Token is invalid' });
  }
};
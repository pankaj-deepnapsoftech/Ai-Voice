import jwt from 'jsonwebtoken';
import { config } from '../config/env.config.js';
import { logger } from './Logger.js';

export const GenerateToken = (payload, expire = '30d') => {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: expire });
};

export const verifyToken = (token) => {
  const data = jwt.verify(token, config.JWT_SECRET);
  logger.info(data);
  return data;
};

import jwt from 'jsonwebtoken';
import { config } from '../config/env.config.js';

export const GenerateToken = (payload, expire) => {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: expire });
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.JWT_SECRET);
};

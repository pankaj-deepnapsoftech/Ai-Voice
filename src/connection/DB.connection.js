import mongoose from 'mongoose';
import { config } from '../config/env.config.js';
import { logger } from '../utils/Logger.js';

export const DbConnection = async () => {
  try {
    const connect = await mongoose.connect(config.MONGODB_URI, {
      dbName: 'Ai_Model',
    });
    logger.info('Database connected successful with host : %s', connect.connection.host);
  } catch (error) {
    logger.error('database not connected, failed to connected database', error);
  }
};

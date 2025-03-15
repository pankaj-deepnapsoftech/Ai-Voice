import { json, urlencoded } from 'express';
import cors from 'cors';
import http from 'http';
import { StatusCodes } from 'http-status-codes';
import cookieParser from 'cookie-parser';
// import path from 'path';
// local imports
import { config } from './config/env.config.js';
import { DbConnection } from './connection/DB.connection.js';
import { BadGateway, CustomError } from './utils/customError.js';
import { logger } from './utils/Logger.js';
import MainRoutes from './routes/index.js';

const SERVER_PORT = 5000;


export function start(app) {
  Connections();

  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ extended: true, limit: '20mb' }));
  app.use(
    cors({
      origin: config.NODE_ENV !== 'development' ? config.CLIENT_URL : config.LOCAL_CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    }),
  );

  app.set('trust proxy', 1);
  app.use(cookieParser());

  app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', config.NODE_ENV !== 'development' ? config.CLIENT_URL : config.LOCAL_CLIENT_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  app.use('/api/v1', MainRoutes);

  app.all('*', (req, _res, next) => {
    next(new BadGateway(`Can't find ${req.protocol}://${req.get('host')}${req.originalUrl} on this server!`, 'Server file Error line no 32'));
  });

  app.use((error, _req, res, next) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(error.serializeErrors());
    } else {
      res.status(StatusCodes.BAD_GATEWAY).json({
        message: error.message || 'somthing went Wrong',
        status: 'error',
        error: error.name,
      });
    }
    next();
  });

  const server = http.createServer(app);
  server.listen(SERVER_PORT, () => {
    logger.info('server is up and running on port : %d', SERVER_PORT);
  });
}

async function Connections() {
  DbConnection();
}

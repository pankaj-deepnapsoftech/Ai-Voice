import express from 'express';
import { start } from './server.js';

function InitServer() {
  const app = express();
  start(app);
}

InitServer();

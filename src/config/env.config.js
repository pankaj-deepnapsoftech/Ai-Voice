import dotenv from 'dotenv';
dotenv.config();

class Config {
  constructor() {
    this.MONGODB_URI = process.env.MONGODB_URI;
    this.NODE_ENV = process.env.NODE_ENV;
    this.LOCAL_CLIENT_URL = process.env.LOCAL_CLIENT_URL;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.EMAIL_ID = process.env.EMAIL_ID;
    this.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
  }
}

export const config = new Config();

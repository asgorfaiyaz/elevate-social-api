import 'dotenv/config';

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elevate-social',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

export const redisConnection = {
  host: process.env.REDIS_HOST ,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
};

export const resultRedisClient = new Redis(redisConnection);
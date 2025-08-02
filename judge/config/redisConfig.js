import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

export const redisConnection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
};

export const resultRedisClient = new Redis(redisConnection);
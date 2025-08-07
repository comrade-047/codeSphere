import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  // tls: {}
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export const connectRedis = () => {
  return new Promise((resolve) => {
    if (redisClient.status === 'ready') {
      console.log('Redis client already connected.');
      return resolve();
    }
    redisClient.on('connect', () => {
      console.log('Redis client connected successfully');
      resolve();
    });
  });
};

export { redisClient };
import {Queue} from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

const redisConnection = {
    host : process.env.REDIS_HOST,
    port : parseInt(process.env.REDIS_PORT || '6379'),
}

export const runQueue = new Queue('run-queue',{
    connection : redisConnection
});

export const submissionQueue = new Queue('submission-queue',{
    connection : redisConnection
});

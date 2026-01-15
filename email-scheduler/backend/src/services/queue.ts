import { Queue } from 'bullmq';
import redisConfig from '../config/redis';

export interface EmailJobData {
  emailId: string;
  recipientEmail: string;
  subject: string;
  body: string;
  senderEmail: string;
}

export const emailQueue = new Queue<EmailJobData>('email-queue', {
  connection: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep completed jobs for 24 hours
      count: 1000,
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days
    },
  },
});

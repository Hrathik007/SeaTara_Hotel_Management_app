import { Worker, Job } from 'bullmq';
import { AppDataSource } from './config/database';
import redisConfig from './config/redis';
import emailService from './services/emailService';
import rateLimiter from './services/rateLimiter';
import schedulerService from './services/schedulerService';
import { EmailJobData } from './services/queue';
import { EmailStatus } from './entities/Email';
import dotenv from 'dotenv';

dotenv.config();

const WORKER_CONCURRENCY = parseInt(process.env.WORKER_CONCURRENCY || '5');
const MIN_DELAY_BETWEEN_EMAILS = parseInt(
  process.env.MIN_DELAY_BETWEEN_EMAILS || '2000'
);

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected for worker');
    startWorker();
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });

function startWorker() {
  const worker = new Worker<EmailJobData>(
    'email-queue',
    async (job: Job<EmailJobData>) => {
      console.log(`Processing job ${job.id} for email ${job.data.emailId}`);

      try {
        // Check rate limit before processing
        const isLimited = await rateLimiter.checkRateLimit(
          job.data.senderEmail
        );

        if (isLimited) {
          console.log(
            `Rate limit exceeded for ${job.data.senderEmail}. Rescheduling...`
          );

          // Update email status to rate limited
          await schedulerService.updateEmailStatus(
            job.data.emailId,
            EmailStatus.RATE_LIMITED
          );

          // Get next available slot
          const nextSlot = await rateLimiter.getNextAvailableSlot(
            job.data.senderEmail
          );
          const delay = nextSlot.getTime() - Date.now();

          // Reschedule the job
          throw new Error(
            `Rate limit exceeded. Rescheduling for ${nextSlot.toISOString()}`
          );
        }

        // Update status to processing
        await schedulerService.updateEmailStatus(
          job.data.emailId,
          EmailStatus.PROCESSING
        );

        // Add delay between emails
        if (MIN_DELAY_BETWEEN_EMAILS > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, MIN_DELAY_BETWEEN_EMAILS)
          );
        }

        // Send email
        await emailService.sendEmail({
          from: job.data.senderEmail,
          to: job.data.recipientEmail,
          subject: job.data.subject,
          html: job.data.body,
        });

        // Increment rate limiter counter
        await rateLimiter.incrementCounter(job.data.senderEmail);

        // Update email status to sent
        await schedulerService.updateEmailStatus(
          job.data.emailId,
          EmailStatus.SENT
        );

        console.log(`Email ${job.data.emailId} sent successfully`);
        return { success: true };
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error);

        // Update email status to failed
        await schedulerService.updateEmailStatus(
          job.data.emailId,
          EmailStatus.FAILED,
          (error as Error).message
        );

        throw error;
      }
    },
    {
      connection: redisConfig,
      concurrency: WORKER_CONCURRENCY,
      limiter: {
        max: 10, // Max 10 jobs processed
        duration: 1000, // per second
      },
    }
  );

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} failed with error:`, err.message);
  });

  worker.on('error', (err) => {
    console.error('Worker error:', err);
  });

  console.log(
    `Worker started with concurrency: ${WORKER_CONCURRENCY}, min delay: ${MIN_DELAY_BETWEEN_EMAILS}ms`
  );
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing worker...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing worker...');
  process.exit(0);
});

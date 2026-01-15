import { redisConnection } from '../config/redis';
import dotenv from 'dotenv';

dotenv.config();

export class RateLimiter {
  private maxEmailsPerHour: number;

  constructor() {
    this.maxEmailsPerHour = parseInt(process.env.MAX_EMAILS_PER_HOUR || '200');
  }

  /**
   * Check if sending an email would exceed the rate limit
   * @param senderEmail - Email address of the sender
   * @returns true if rate limit would be exceeded, false otherwise
   */
  async checkRateLimit(senderEmail: string): Promise<boolean> {
    const currentHour = this.getCurrentHourKey();
    const key = `rate_limit:${senderEmail}:${currentHour}`;

    const count = await redisConnection.get(key);
    const currentCount = count ? parseInt(count) : 0;

    return currentCount >= this.maxEmailsPerHour;
  }

  /**
   * Increment the rate limit counter for a sender
   * @param senderEmail - Email address of the sender
   */
  async incrementCounter(senderEmail: string): Promise<void> {
    const currentHour = this.getCurrentHourKey();
    const key = `rate_limit:${senderEmail}:${currentHour}`;

    const pipeline = redisConnection.pipeline();
    pipeline.incr(key);
    pipeline.expire(key, 3600); // Expire after 1 hour
    await pipeline.exec();
  }

  /**
   * Get current count for a sender in the current hour
   * @param senderEmail - Email address of the sender
   */
  async getCurrentCount(senderEmail: string): Promise<number> {
    const currentHour = this.getCurrentHourKey();
    const key = `rate_limit:${senderEmail}:${currentHour}`;

    const count = await redisConnection.get(key);
    return count ? parseInt(count) : 0;
  }

  /**
   * Get the next available time slot for sending
   * @param senderEmail - Email address of the sender
   */
  async getNextAvailableSlot(senderEmail: string): Promise<Date> {
    const isLimited = await this.checkRateLimit(senderEmail);
    
    if (!isLimited) {
      return new Date();
    }

    // If rate limited, return the start of next hour
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
    return nextHour;
  }

  /**
   * Get current hour key for Redis storage
   */
  private getCurrentHourKey(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    return `${year}-${month}-${day}-${hour}`;
  }
}

export default new RateLimiter();

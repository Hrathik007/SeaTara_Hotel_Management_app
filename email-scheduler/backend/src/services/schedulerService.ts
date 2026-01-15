import { AppDataSource } from '../config/database';
import { Email, EmailStatus } from '../entities/Email';
import { emailQueue, EmailJobData } from './queue';
import rateLimiter from './rateLimiter';
import { parse } from 'csv-parse/sync';

export class SchedulerService {
  private emailRepository = AppDataSource.getRepository(Email);

  /**
   * Schedule a single email
   */
  async scheduleEmail(
    recipientEmail: string,
    subject: string,
    body: string,
    senderEmail: string,
    scheduledTime: Date,
    userId?: string
  ): Promise<Email> {
    // Create email record in database
    const email = this.emailRepository.create({
      recipientEmail,
      subject,
      body,
      senderEmail,
      scheduledTime,
      userId,
      status: EmailStatus.SCHEDULED,
    });

    await this.emailRepository.save(email);

    // Calculate delay for BullMQ
    const delay = scheduledTime.getTime() - Date.now();

    // Add job to queue
    const job = await emailQueue.add(
      'send-email',
      {
        emailId: email.id,
        recipientEmail,
        subject,
        body,
        senderEmail,
      },
      {
        delay: delay > 0 ? delay : 0,
        jobId: email.id, // Use email ID as job ID for idempotency
      }
    );

    // Update email with job ID
    email.jobId = job.id as string;
    await this.emailRepository.save(email);

    return email;
  }

  /**
   * Schedule multiple emails from CSV
   * Note: Checks rate limit for each email during scheduling to provide
   * accurate schedule times. For very large batches (1000+), this could
   * be optimized by checking once and calculating schedules locally.
   */
  async scheduleEmailsFromCSV(
    csvContent: string,
    subject: string,
    body: string,
    senderEmail: string,
    startTime: Date,
    delayBetweenEmails: number,
    userId?: string
  ): Promise<Email[]> {
    // Parse CSV to extract email addresses
    const emails = this.parseEmailsFromCSV(csvContent);

    const scheduledEmails: Email[] = [];
    let currentScheduleTime = new Date(startTime);

    for (const recipientEmail of emails) {
      // Check rate limit and adjust schedule time if needed
      const isLimited = await rateLimiter.checkRateLimit(senderEmail);
      if (isLimited) {
        currentScheduleTime = await rateLimiter.getNextAvailableSlot(senderEmail);
      }

      const email = await this.scheduleEmail(
        recipientEmail,
        subject,
        body,
        senderEmail,
        currentScheduleTime,
        userId
      );

      scheduledEmails.push(email);

      // Add delay for next email
      currentScheduleTime = new Date(
        currentScheduleTime.getTime() + delayBetweenEmails
      );
    }

    return scheduledEmails;
  }

  /**
   * Parse email addresses from CSV content
   */
  private parseEmailsFromCSV(csvContent: string): string[] {
    const records = parse(csvContent, {
      skip_empty_lines: true,
      trim: true,
    });

    const emails: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const record of records) {
      for (const field of record) {
        if (emailRegex.test(field)) {
          emails.push(field);
        }
      }
    }

    return emails;
  }

  /**
   * Get scheduled emails
   */
  async getScheduledEmails(userId?: string): Promise<Email[]> {
    const where: any = {
      status: EmailStatus.SCHEDULED,
    };

    if (userId) {
      where.userId = userId;
    }

    return this.emailRepository.find({
      where,
      order: { scheduledTime: 'ASC' },
    });
  }

  /**
   * Get sent emails
   */
  async getSentEmails(userId?: string): Promise<Email[]> {
    const where: any = [
      { status: EmailStatus.SENT },
      { status: EmailStatus.FAILED },
    ];

    if (userId) {
      where.forEach((w: any) => (w.userId = userId));
    }

    return this.emailRepository.find({
      where,
      order: { sentAt: 'DESC' },
    });
  }

  /**
   * Get email by ID
   */
  async getEmailById(id: string): Promise<Email | null> {
    return this.emailRepository.findOne({ where: { id } });
  }

  /**
   * Update email status
   */
  async updateEmailStatus(
    id: string,
    status: EmailStatus,
    errorMessage?: string
  ): Promise<void> {
    const email = await this.emailRepository.findOne({ where: { id } });
    if (!email) {
      throw new Error('Email not found');
    }

    email.status = status;
    if (status === EmailStatus.SENT) {
      email.sentAt = new Date();
    }
    if (errorMessage) {
      email.errorMessage = errorMessage;
    }

    await this.emailRepository.save(email);
  }
}

export default new SchedulerService();

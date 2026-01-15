import { Request, Response } from 'express';
import schedulerService from '../services/schedulerService';
import { body, validationResult } from 'express-validator';

export const scheduleEmailValidation = [
  body('recipientEmail').isEmail().withMessage('Invalid recipient email'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('body').notEmpty().withMessage('Body is required'),
  body('senderEmail').isEmail().withMessage('Invalid sender email'),
  body('scheduledTime').isISO8601().withMessage('Invalid scheduled time'),
];

export const scheduleBulkEmailValidation = [
  body('csvContent').notEmpty().withMessage('CSV content is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('body').notEmpty().withMessage('Body is required'),
  body('senderEmail').isEmail().withMessage('Invalid sender email'),
  body('startTime').isISO8601().withMessage('Invalid start time'),
  body('delayBetweenEmails')
    .isInt({ min: 0 })
    .withMessage('Invalid delay between emails'),
];

export class EmailController {
  async scheduleEmail(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { recipientEmail, subject, body, senderEmail, scheduledTime } =
        req.body;
      const userId = req.user ? (req.user as any).id : undefined;

      const email = await schedulerService.scheduleEmail(
        recipientEmail,
        subject,
        body,
        senderEmail,
        new Date(scheduledTime),
        userId
      );

      res.status(201).json({
        message: 'Email scheduled successfully',
        email,
      });
    } catch (error) {
      console.error('Error scheduling email:', error);
      res.status(500).json({
        error: 'Failed to schedule email',
        message: (error as Error).message,
      });
    }
  }

  async scheduleBulkEmails(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        csvContent,
        subject,
        body,
        senderEmail,
        startTime,
        delayBetweenEmails,
      } = req.body;
      const userId = req.user ? (req.user as any).id : undefined;

      const emails = await schedulerService.scheduleEmailsFromCSV(
        csvContent,
        subject,
        body,
        senderEmail,
        new Date(startTime),
        delayBetweenEmails,
        userId
      );

      res.status(201).json({
        message: `${emails.length} emails scheduled successfully`,
        count: emails.length,
        emails,
      });
    } catch (error) {
      console.error('Error scheduling bulk emails:', error);
      res.status(500).json({
        error: 'Failed to schedule bulk emails',
        message: (error as Error).message,
      });
    }
  }

  async getScheduledEmails(req: Request, res: Response) {
    try {
      const userId = req.user ? (req.user as any).id : undefined;
      const emails = await schedulerService.getScheduledEmails(userId);

      res.json({
        count: emails.length,
        emails,
      });
    } catch (error) {
      console.error('Error fetching scheduled emails:', error);
      res.status(500).json({
        error: 'Failed to fetch scheduled emails',
        message: (error as Error).message,
      });
    }
  }

  async getSentEmails(req: Request, res: Response) {
    try {
      const userId = req.user ? (req.user as any).id : undefined;
      const emails = await schedulerService.getSentEmails(userId);

      res.json({
        count: emails.length,
        emails,
      });
    } catch (error) {
      console.error('Error fetching sent emails:', error);
      res.status(500).json({
        error: 'Failed to fetch sent emails',
        message: (error as Error).message,
      });
    }
  }

  async getEmailById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const email = await schedulerService.getEmailById(id);

      if (!email) {
        return res.status(404).json({ error: 'Email not found' });
      }

      res.json(email);
    } catch (error) {
      console.error('Error fetching email:', error);
      res.status(500).json({
        error: 'Failed to fetch email',
        message: (error as Error).message,
      });
    }
  }
}

export default new EmailController();

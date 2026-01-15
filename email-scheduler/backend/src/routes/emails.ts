import { Router } from 'express';
import emailController, {
  scheduleEmailValidation,
  scheduleBulkEmailValidation,
} from '../controllers/emailController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(isAuthenticated);

// Schedule a single email
router.post(
  '/schedule',
  scheduleEmailValidation,
  emailController.scheduleEmail.bind(emailController)
);

// Schedule bulk emails from CSV
router.post(
  '/schedule-bulk',
  scheduleBulkEmailValidation,
  emailController.scheduleBulkEmails.bind(emailController)
);

// Get scheduled emails
router.get(
  '/scheduled',
  emailController.getScheduledEmails.bind(emailController)
);

// Get sent emails
router.get('/sent', emailController.getSentEmails.bind(emailController));

// Get email by ID
router.get('/:id', emailController.getEmailById.bind(emailController));

export default router;

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  googleId: string;
}

export interface Email {
  id: string;
  recipientEmail: string;
  subject: string;
  body: string;
  senderEmail: string;
  scheduledTime: string;
  sentAt?: string;
  status: 'scheduled' | 'processing' | 'sent' | 'failed' | 'rate_limited';
  errorMessage?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleEmailRequest {
  recipientEmail: string;
  subject: string;
  body: string;
  senderEmail: string;
  scheduledTime: string;
}

export interface ScheduleBulkEmailRequest {
  csvContent: string;
  subject: string;
  body: string;
  senderEmail: string;
  startTime: string;
  delayBetweenEmails: number;
}

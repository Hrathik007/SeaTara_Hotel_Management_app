import axios from 'axios';
import { User, Email, ScheduleEmailRequest, ScheduleBulkEmailRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get('/auth/user');
      return response.data.user;
    } catch (error) {
      return null;
    }
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  loginWithGoogle: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },
};

export const emailService = {
  scheduleEmail: async (data: ScheduleEmailRequest): Promise<Email> => {
    const response = await api.post('/api/emails/schedule', data);
    return response.data.email;
  },

  scheduleBulkEmails: async (data: ScheduleBulkEmailRequest): Promise<{ count: number; emails: Email[] }> => {
    const response = await api.post('/api/emails/schedule-bulk', data);
    return response.data;
  },

  getScheduledEmails: async (): Promise<Email[]> => {
    const response = await api.get('/api/emails/scheduled');
    return response.data.emails;
  },

  getSentEmails: async (): Promise<Email[]> => {
    const response = await api.get('/api/emails/sent');
    return response.data.emails;
  },

  getEmailById: async (id: string): Promise<Email> => {
    const response = await api.get(`/api/emails/${id}`);
    return response.data;
  },
};

export default api;

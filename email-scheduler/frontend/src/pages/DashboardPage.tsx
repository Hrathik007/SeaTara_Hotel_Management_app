import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { EmailTable } from '../components/EmailTable';
import { ComposeEmailModal } from '../components/ComposeEmailModal';
import { User, Email } from '../types';
import { authService, emailService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'scheduled' | 'sent'>('scheduled');
  const [scheduledEmails, setScheduledEmails] = useState<Email[]>([]);
  const [sentEmails, setSentEmails] = useState<Email[]>([]);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchEmails();
    }
  }, [user, activeTab]);

  const checkAuth = async () => {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
  };

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'scheduled') {
        const emails = await emailService.getScheduledEmails();
        setScheduledEmails(emails);
      } else {
        const emails = await emailService.getSentEmails();
        setSentEmails(emails);
      }
    } catch (error: any) {
      toast.error('Failed to fetch emails');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComposeSuccess = () => {
    fetchEmails();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Email Dashboard</h2>
          <Button onClick={() => setIsComposeModalOpen(true)}>
            + Compose New Email
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('scheduled')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'scheduled'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Scheduled Emails
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'sent'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sent Emails
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'scheduled' ? (
              <EmailTable
                emails={scheduledEmails}
                type="scheduled"
                isLoading={isLoading}
              />
            ) : (
              <EmailTable
                emails={sentEmails}
                type="sent"
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </main>

      <ComposeEmailModal
        isOpen={isComposeModalOpen}
        onClose={() => setIsComposeModalOpen(false)}
        onSuccess={handleComposeSuccess}
      />
    </div>
  );
};

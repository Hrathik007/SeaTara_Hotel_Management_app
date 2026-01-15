import React, { useState } from 'react';
import { Button } from './Button';
import { Input, Textarea } from './Input';
import { emailService } from '../services/api';
import toast from 'react-hot-toast';

interface ComposeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ComposeEmailModal: React.FC<ComposeEmailModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState('');
  const [emailCount, setEmailCount] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [delayBetweenEmails, setDelayBetweenEmails] = useState('2000');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      const content = await file.text();
      setCsvContent(content);

      // Count email addresses
      const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
      const matches = content.match(emailRegex);
      setEmailCount(matches ? matches.length : 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!csvContent) {
        throw new Error('Please upload a CSV file');
      }

      await emailService.scheduleBulkEmails({
        csvContent,
        subject,
        body,
        senderEmail,
        startTime: new Date(startTime).toISOString(),
        delayBetweenEmails: parseInt(delayBetweenEmails),
      });

      toast.success(`${emailCount} emails scheduled successfully!`);
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to schedule emails');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSubject('');
    setBody('');
    setSenderEmail('');
    setCsvFile(null);
    setCsvContent('');
    setEmailCount(0);
    setStartTime('');
    setDelayBetweenEmails('2000');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Compose New Email</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <Input
            label="Sender Email"
            type="email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder="sender@example.com"
            required
          />

          <Input
            label="Subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            required
          />

          <Textarea
            label="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Email body content..."
            rows={6}
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV with Email Addresses
            </label>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            {emailCount > 0 && (
              <p className="mt-2 text-sm text-green-600">
                ✓ {emailCount} email address{emailCount !== 1 ? 'es' : ''} detected
              </p>
            )}
          </div>

          <Input
            label="Start Time"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />

          <Input
            label="Delay Between Emails (milliseconds)"
            type="number"
            value={delayBetweenEmails}
            onChange={(e) => setDelayBetweenEmails(e.target.value)}
            min="1000"
            placeholder="2000"
            required
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Schedule Emails
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

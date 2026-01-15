import React from 'react';
import { Email } from '../types';

interface EmailTableProps {
  emails: Email[];
  type: 'scheduled' | 'sent';
  isLoading: boolean;
}

export const EmailTable: React.FC<EmailTableProps> = ({ emails, type, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No {type} emails
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {type === 'scheduled'
            ? 'Get started by scheduling your first email.'
            : 'Sent emails will appear here.'}
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      scheduled: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      rate_limited: 'bg-orange-100 text-orange-800',
    };

    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          statusClasses[status as keyof typeof statusClasses]
        }`}
      >
        {status.replace('_', ' ')}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recipient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subject
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {type === 'scheduled' ? 'Scheduled Time' : 'Sent Time'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {emails.map((email) => (
            <tr key={email.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {email.recipientEmail}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {email.subject}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {type === 'scheduled'
                  ? formatDate(email.scheduledTime)
                  : email.sentAt
                  ? formatDate(email.sentAt)
                  : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(email.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

import React from 'react';
import type { Email } from '../types/types';

// --- Helper Component from FilterBar (Needed for rendering) ---
const CategoryChip: React.FC<{ category: string }> = ({ category }) => {
    const colorMap: { [key: string]: string } = {
        'Interested': 'bg-green-100 text-green-800 border-green-300',
        'Meeting Booked': 'bg-teal-100 text-teal-800 border-teal-300',
        'Not Interested': 'bg-red-100 text-red-800 border-red-300',
        'Out of Office': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'Spam': 'bg-purple-100 text-purple-800 border-purple-300',
        'General / Newsletter': 'bg-blue-100 text-blue-800 border-blue-300',
        'Uncategorized': 'bg-gray-200 text-gray-700 border-gray-400',
    };
    const classes = colorMap[category] || colorMap['Uncategorized'];

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
            {category}
        </span>
    );
};

// --- Helper Formatting Function ---
const formatDate = (isoString: string) => {
    if (!isoString) return 'N/A';
    try {
        return new Date(isoString).toLocaleTimeString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return isoString.substring(0, 10);
    }
};

// --- Main EmailTable Component ---

interface EmailTableProps {
    emails: Email[];
    loading: boolean;
}

const EmailTable: React.FC<EmailTableProps> = ({ emails, loading }) => {
    return (
        <div className="overflow-hidden shadow-lg rounded-xl">
            <div className="min-w-full">
                <div className="bg-gray-200 grid grid-cols-12 py-3 px-6 text-xs font-semibold uppercase tracking-wider text-gray-600">
                    <div className="col-span-3">Subject</div>
                    <div className="col-span-2 hidden md:block">From</div>
                    <div className="col-span-3 text-center">Category</div>
                    <div className="col-span-2 hidden sm:block">Account</div>
                    <div className="col-span-2 text-right">Date</div>
                </div>

                {loading ? (
                    <div className="text-center py-12 bg-white text-lg text-gray-600">
                        Loading emails...
                    </div>
                ) : emails.length === 0 ? (
                    <div className="text-center py-12 bg-white text-lg text-gray-600">
                        No emails found matching your criteria.
                    </div>
                ) : (
                    emails.map((email) => (
                        <div key={email.id} className="grid grid-cols-12 items-center border-b border-gray-100 p-4 hover:bg-gray-50 transition duration-150 bg-white">
                            <div className="col-span-3 text-sm font-medium text-gray-900 truncate pr-2" title={email.subject}>
                                {email.subject}
                            </div>
                            <div className="col-span-2 text-sm text-gray-500 hidden md:block truncate pr-2" title={email.from}>
                                {email.from}
                            </div>
                            <div className="col-span-3 flex justify-center">
                                <CategoryChip category={email.category} />
                            </div>
                            <div className="col-span-2 text-sm text-gray-500 hidden sm:block truncate pr-2" title={email.account}>
                                {email.account.split('@')[0]}
                            </div>
                            <div className="col-span-2 text-sm text-gray-500 text-right">
                                {formatDate(email.date)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EmailTable;
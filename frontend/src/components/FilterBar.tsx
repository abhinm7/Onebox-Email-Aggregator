import React from 'react';
import type { Filters } from '../types/types'; 
import { AVAILABLE_CATEGORIES, AVAILABLE_ACCOUNTS, AVAILABLE_FOLDERS } from '../types/types';

// --- Helper Components ---

interface ChipProps { category: string; }
const CategoryChip: React.FC<ChipProps> = ({ category }) => {
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

interface ButtonProps { text: string; onClick: () => void; active: boolean; }
const FilterButton: React.FC<ButtonProps> = ({ text, onClick, active }) => (
    <button
        onClick={onClick}
        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 
        ${active 
            ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
    >
        {text}
    </button>
);

interface FilterChipProps { category: string; onClick: () => void; active: boolean; }
const CategoryChipFilter: React.FC<FilterChipProps> = ({ category, onClick, active }) => {
    return (
        <button onClick={onClick} className={`transition duration-150 rounded-full ${active ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}>
            <CategoryChip category={category} />
        </button>
    );
};

interface FilterBarProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    filters: Filters;
    handleFilterChange: (key: keyof Filters, value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ searchTerm, setSearchTerm, filters, handleFilterChange }) => {

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    Basic Email Search (Keyword)
                </label>
                <input
                    id="search"
                    type="text"
                    placeholder="Search by subject, sender, or body..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-800 mb-3">Filter by AI Category</h3>
                <div className="flex flex-wrap gap-2">
                    {AVAILABLE_CATEGORIES.map(cat => (
                        <CategoryChipFilter 
                            key={cat} 
                            category={cat} 
                            onClick={() => handleFilterChange('category', cat)} 
                            active={filters.category === cat}
                        />
                    ))}
                </div>
            </div>

            {/* Account and Folder Filters */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-800 mb-3">Filter by Account</h3>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_ACCOUNTS.map(account => (
                            <FilterButton
                                key={account}
                                text={account.split('@')[0]}
                                active={filters.account === account}
                                onClick={() => handleFilterChange('account', account)}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-800 mb-3">Filter by Folder</h3>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_FOLDERS.map(folder => (
                            <FilterButton
                                key={folder}
                                text={folder}
                                active={filters.folder === folder}
                                onClick={() => handleFilterChange('folder', folder)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
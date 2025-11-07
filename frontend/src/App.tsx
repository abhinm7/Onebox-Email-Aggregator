import React from 'react';
import FilterBar from './components/FilterBar';
import EmailTable from './components/EmailTable';
import { useEmailFilter } from './hooks/useEmailFilter'; 

const App: React.FC = () => {
  const {
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    filteredEmails,
  } = useEmailFilter();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">OneBox AI Dashboard</h1>
        <p className="text-gray-500">Feature 5: Searchable and Filterable Email Onebox.</p>
      </header>

      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        handleFilterChange={handleFilterChange}
      />

      <EmailTable
        emails={filteredEmails}
        loading={loading}
      />

      <footer className="mt-8 text-center text-xs text-gray-400">
        Built for ReachInbox Assignment.
      </footer>
    </div>
  );
};

export default App;
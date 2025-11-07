import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Email, Filters } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/search';

// Debounce utility for optimized API calls
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: any;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export const useEmailFilter = () => {
  const [allEmails, setAllEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    category: '',
    account: '',
    folder: '',
  });

  // Fetch emails from backend (Elasticsearch-powered API)
  const fetchEmails = useCallback(async (query: string = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);

      const url = `${API_BASE_URL}?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const results: Email[] = data.results.map((item: any) => ({
        ...item,
        id: item.id || item.messageId || 'unknown-' + Math.random(),
      }));

      setAllEmails(results);
    } catch (error) {
      console.error('Failed to fetch emails:', error);
      setAllEmails([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter emails locally by category, account, and folder
  const filteredEmails = useMemo(() => {
    return allEmails.filter(email => {
      const { category, account, folder } = filters;
      if (category && email.category !== category) return false;
      if (account && email.account !== account) return false;
      if (folder && email.folder !== folder) return false;
      return true;
    });
  }, [allEmails, filters]);

  // Debounce user search input before triggering fetch
  const debouncedSearch = useCallback(
    debounce((query: string) => fetchEmails(query), 400),
    [fetchEmails]
  );

  // Trigger search when query changes
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Initial data load on mount
  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  // Handle filter selection toggles
  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? '' : value,
    }));
  };

  // Return computed state and handlers for UI integration
  return {
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    filteredEmails,
  };
};

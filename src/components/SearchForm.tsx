'use client';

import { useState } from 'react';
import { Realm } from '@/types/wow';

interface SearchFormProps {
  servers: Realm[];
}

export default function SearchForm({ servers }: SearchFormProps) {
  const [selectedServer, setSelectedServer] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedServer || !characterName) return;
    
    setIsLoading(true);
    
    window.location.href = `/search/${selectedServer}/${characterName.toLowerCase()}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="server" className="block text-sm font-medium text-slate-300 mb-1">
          Select Server
        </label>
        <div className="relative">
          <select
            id="server"
            value={selectedServer}
            onChange={(e) => setSelectedServer(e.target.value)}
            className="block w-full rounded-md border border-slate-600 bg-slate-700 py-2.5 pl-3 pr-10 text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
            required
          >
            <option value="">Select a server</option>
            {servers.map((server) => (
              <option key={server.slug} value={server.slug}>
                {server.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="character" className="block text-sm font-medium text-slate-300 mb-1">
          Character Name
        </label>
        <input
          type="text"
          id="character"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          className="block w-full rounded-md border border-slate-600 bg-slate-700 py-2.5 px-3 text-slate-200 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter character name"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !selectedServer || !characterName}
        className="w-full rounded-md bg-blue-600 text-white py-2.5 px-4 font-medium shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching...
          </span>
        ) : 'Search'}
      </button>
    </form>
  );
} 
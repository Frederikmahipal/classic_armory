import Image from 'next/image';
import { Realm } from '@/types/wow';
import SearchForm from '@/components/SearchForm';

async function getServers() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/realms`, { 
    cache: 'no-store',
    next: { revalidate: 60 } 
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch servers');
  }
  
  const data = await response.json();
  return data.realms || [];
}

export default async function Home() {
  const servers = await getServers();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 to-slate-900">
      <header className="bg-slate-950 text-white p-5 shadow-lg border-b border-slate-800">
        <div className="container mx-auto flex items-center">
          <div className="mr-3 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">WoW Classic Anniversary Lookup</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-6 flex items-center justify-center">
        <div className="w-full max-w-md overflow-hidden rounded-xl shadow-2xl border border-slate-700">
          <div className="bg-blue-600 p-5">
            <h2 className="text-xl font-semibold text-white">Character Search</h2>
          </div>
          <div className="p-6 bg-slate-800">
            <SearchForm servers={servers} />
          </div>
        </div>
      </main>
      
      <footer className="bg-slate-950 text-slate-400 p-4 border-t border-slate-800">
        <div className="container mx-auto text-center text-sm">
          <p>WoW Classic Anniversary Character Lookup - Data from Blizzard API</p>
        </div>
      </footer>
    </div>
  );
}

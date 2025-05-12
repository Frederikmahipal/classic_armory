import Link from 'next/link';
import { Character } from '@/types/character';

async function getSearchResults(realm: string, name: string): Promise<Character[]> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/characters/search?realm=${realm}&name=${name}`;
    const response = await fetch(apiUrl, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.characters || [];
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  }
}

export default async function SearchResults({ 
  params 
}: { 
  params: { realm: string; name: string } 
}) {
  const { realm, name } = params;
  const characters = await getSearchResults(realm, name);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 to-slate-900">
      <header className="bg-slate-950 text-white p-5 shadow-lg border-b border-slate-800">
        <div className="container mx-auto">
          <div className="flex items-center">
            <div className="mr-3 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">WoW Classic Anniversary Lookup</h1>
          </div>
          <div className="mt-3 text-slate-300">
            <p>Search results for: <span className="font-semibold">{name}</span> on <span className="font-semibold">{realm}</span></p>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-6">
        <div className="overflow-hidden rounded-xl shadow-2xl border border-slate-700">
          <div className="bg-blue-600 p-4">
            <h2 className="text-lg font-medium text-white">Characters Found ({characters.length})</h2>
          </div>
          
          {characters.length === 0 ? (
            <div className="p-8 text-center bg-slate-800">
              <div className="mb-4 text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-lg font-medium text-white mb-2">No Characters Found</h3>
              </div>
              <p className="text-slate-300 mb-2">We couldn't find any characters with the name "{name}" on the realm "{realm}".</p>
              <p className="text-slate-300 mb-6">This could be because:</p>
              <ul className="text-slate-300 mb-6 list-disc list-inside">
                <li>The character name is spelled differently</li>
                <li>The character is on a different realm</li>
                <li>The character hasn't been created yet</li>
                <li>The Blizzard API is currently unavailable</li>
              </ul>
              <Link href="/" className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors">
                Try Another Search
              </Link>
            </div>
          ) : (
            <div className="bg-slate-800">
              <ul className="divide-y divide-slate-700">
                {characters.map((character) => (
                  <li key={character.name} className="hover:bg-slate-700 transition-colors">
                    <Link 
                      href={`/character/${realm}/${character.name.toLowerCase()}`}
                      className="block p-4 text-slate-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white text-lg">{character.name}</p>
                          <p className="text-sm text-slate-400">
                            Level {character.level} {character.race} {character.class}
                          </p>
                        </div>
                        <div className="text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="bg-slate-900 px-4 py-3 flex justify-between">
            <Link 
              href="/"
              className="inline-flex items-center px-3 py-1.5 border border-slate-600 text-sm font-medium rounded-md text-slate-200 bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              Back to Search
            </Link>
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
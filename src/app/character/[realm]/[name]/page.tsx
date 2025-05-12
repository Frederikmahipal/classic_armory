import Link from 'next/link';
import { CharacterDetails } from '@/types/character';

async function getCharacterDetails(realm: string, name: string): Promise<CharacterDetails | null> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/characters/${realm}/${name.toLowerCase()}`;
    const response = await fetch(apiUrl, { 
      cache: 'no-store',
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching character details:', error);
    return null;
  }
}

export default async function CharacterDetailPage({
  params
}: {
  params: { realm: string; name: string }
}) {
  const { realm, name } = params;
  const character = await getCharacterDetails(realm, name);

  if (!character) {
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
          </div>
        </header>
        
        <main className="flex-1 container mx-auto p-6 flex items-center justify-center">
          <div className="bg-slate-800 rounded-xl shadow-2xl p-8 max-w-md w-full text-center border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Character Not Found</h2>
            <p className="text-slate-300 mb-6">The character you're looking for could not be found.</p>
            <div className="flex flex-col gap-3">
              <Link 
                href={`/search/${realm}/${name}`}
                className="inline-flex items-center justify-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-200 bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                Back to Search Results
              </Link>
              <Link 
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 transition-colors"
              >
                New Search
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

  const getClassColor = (characterClass: string): string => {
    const classColors: {[key: string]: string} = {
      'Warrior': 'text-[#C79C6E]',
      'Paladin': 'text-[#F58CBA]',
      'Hunter': 'text-[#ABD473]',
      'Rogue': 'text-[#FFF569]',
      'Priest': 'text-[#FFFFFF]',
      'Shaman': 'text-[#0070DE]',
      'Mage': 'text-[#69CCF0]',
      'Warlock': 'text-[#9482C9]',
      'Druid': 'text-[#FF7D0A]'
    };
    return classColors[characterClass] || 'text-gray-100';
  };

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
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-6">
        <div className="overflow-hidden rounded-xl shadow-2xl border border-slate-700">
          <div className="p-6 bg-blue-600 flex items-center">
            <h2 className="text-2xl font-bold text-white">{character.name}</h2>
            <span className="ml-3 text-sm bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md">
              {realm}
            </span>
          </div>
          
          <div className="bg-slate-800 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-white mb-4 border-b border-slate-700 pb-2">Character Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-slate-200">
                    <span className="text-slate-400">Level</span>
                    <span className="font-medium">{character.level}</span>
                  </div>
                  <div className="flex justify-between text-slate-200">
                    <span className="text-slate-400">Race</span>
                    <span className="font-medium">{character.race}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class</span>
                    <span className={`font-medium ${getClassColor(character.class)}`}>{character.class}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Faction</span>
                    <span className={`font-medium ${character.faction === 'Alliance' ? 'text-blue-400' : 'text-red-400'}`}>
                      {character.faction}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-4 border-b border-slate-700 pb-2">Additional Info</h3>
                <div className="space-y-3">
                  {character.guild && (
                    <div className="flex justify-between text-slate-200">
                      <span className="text-slate-400">Guild</span>
                      <span className="font-medium">{character.guild}</span>
                    </div>
                  )}
                  {character.achievementPoints !== undefined && (
                    <div className="flex justify-between text-slate-200">
                      <span className="text-slate-400">Achievement Points</span>
                      <span className="font-medium">{character.achievementPoints}</span>
                    </div>
                  )}
                  {character.itemLevel !== undefined && (
                    <div className="flex justify-between text-slate-200">
                      <span className="text-slate-400">Item Level</span>
                      <span className="font-medium">{character.itemLevel}</span>
                    </div>
                  )}
                  {character.lastSeen && (
                    <div className="flex justify-between text-slate-200">
                      <span className="text-slate-400">Last Seen</span>
                      <span className="font-medium">{character.lastSeen}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <Link
                href={`/search/${realm}/${name}`}
                className="inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-200 bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                Back to Search Results
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 transition-colors"
              >
                New Search
              </Link>
            </div>
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
import { NextRequest, NextResponse } from 'next/server';
import { fetchFromBlizzardApi } from '@/lib/blizzard';
import { Character } from '@/types/character';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const realm = searchParams.get('realm');
  const name = searchParams.get('name');

  if (!realm || !name) {
    return NextResponse.json(
      { error: 'Both realm and name parameters are required' },
      { status: 400 }
    );
  }

  try {
    // First, we'll try to find an exact match
    try {
      const characterData = await fetchFromBlizzardApi(
        `https://eu.api.blizzard.com/profile/wow/character/${realm}/${name.toLowerCase()}?locale=en_GB`,
        'profile-classic1x-eu'
      );
      
      if (characterData) {
        // Format the result to match our Character interface
        const result: Character = {
          name: characterData.name,
          level: characterData.level,
          class: getClassName(characterData.character_class?.id),
          race: getRaceName(characterData.race?.id),
        };
        
        return NextResponse.json({ characters: [result] });
      }
    } catch (error) {
      // If exact match fails, it's not an error, we'll continue with search
      console.log('Exact character match not found, trying search');
    }

    // If no exact match, use the search endpoint
    // Note: Blizzard API may not actually have a search endpoint for classic1x
    const searchResults = await fetchFromBlizzardApi(
      `https://eu.api.blizzard.com/profile/wow/character/search?namespace=profile-classic1x-eu&realm=${realm}&name=${name.toLowerCase()}&locale=en_GB&orderby=level`, 
      'profile-classic1x-eu'
    );
    
    if (!searchResults.results || searchResults.results.length === 0) {
      // No results - return empty array
      return NextResponse.json({ 
        characters: [] 
      });
    }
    
    // Format the search results
    const characters = searchResults.results.map((char: any) => ({
      name: char.character.name,
      level: char.character.level,
      class: getClassName(char.character.playable_class.id),
      race: getRaceName(char.character.playable_race.id),
    }));
    
    return NextResponse.json({ characters });
  } catch (error) {
    console.error('Error searching for characters:', error);
    
    // Return empty array rather than mock data
    return NextResponse.json({ 
      characters: [],
      error: 'Failed to fetch character data from Blizzard API'
    }, { status: 500 });
  }
}

// Helper functions to convert IDs to names
function getClassName(id?: number): string {
  const classes: {[key: number]: string} = {
    1: 'Warrior',
    2: 'Paladin',
    3: 'Hunter',
    4: 'Rogue',
    5: 'Priest',
    7: 'Shaman',
    8: 'Mage',
    9: 'Warlock',
    11: 'Druid'
  };
  return classes[id || 0] || 'Unknown';
}

function getRaceName(id?: number): string {
  const races: {[key: number]: string} = {
    1: 'Human',
    2: 'Orc',
    3: 'Dwarf',
    4: 'Night Elf',
    5: 'Undead',
    6: 'Tauren',
    7: 'Gnome',
    8: 'Troll',
    10: 'Blood Elf',
    11: 'Draenei'
  };
  return races[id || 0] || 'Unknown';
} 
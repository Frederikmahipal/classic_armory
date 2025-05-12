import { NextRequest, NextResponse } from 'next/server';
import { fetchFromBlizzardApi } from '@/lib/blizzard';
import { CharacterDetails } from '@/types/character';

export async function GET(
  request: NextRequest,
  { params }: { params: { realm: string; name: string } }
) {
  const { realm, name } = params;

  if (!realm || !name) {
    return NextResponse.json(
      { error: 'Both realm and name parameters are required' },
      { status: 400 }
    );
  }

  try {
    const characterData = await fetchFromBlizzardApi(
      `https://eu.api.blizzard.com/profile/wow/character/${realm}/${name.toLowerCase()}?locale=en_GB`,
      'profile-classic1x-eu'
    );


    let guildData = null;
    try {
      guildData = await fetchFromBlizzardApi(
        `https://eu.api.blizzard.com/profile/wow/character/${realm}/${name.toLowerCase()}/guild?locale=en_GB`,
        'profile-classic1x-eu'
      );
    } catch (error) {
      console.log('Guild data not available');
    }

    let equipmentData = null;
    try {
      equipmentData = await fetchFromBlizzardApi(
        `https://eu.api.blizzard.com/profile/wow/character/${realm}/${name.toLowerCase()}/equipment?locale=en_GB`,
        'profile-classic1x-eu'
      );
    } catch (error) {
      console.log('Equipment data not available');
    }

    // Build the character details object
    const characterDetails: CharacterDetails = {
      name: characterData.name,
      level: characterData.level,
      class: getClassName(characterData.character_class?.id),
      race: getRaceName(characterData.race?.id),
      faction: getFaction(characterData.race?.id),
      guild: guildData?.guild?.name,
      lastSeen: new Date().toISOString().split('T')[0], // current date as placeholder
    };

    // Add item level if we have equipment data
    if (equipmentData && equipmentData.equipped_item_level) {
      characterDetails.itemLevel = equipmentData.equipped_item_level;
    }

    return NextResponse.json(characterDetails);
  } catch (error) {
    console.error('Error fetching character details:', error);
    
    // Return 404 if character not found or 500 for other errors
    return NextResponse.json(
      { error: 'Character not found or unavailable' },
      { status: 404 }
    );
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

function getFaction(raceId?: number): string {
  const allianceRaces = [1, 3, 4, 7, 11]; 
  const hordeRaces = [2, 5, 6, 8, 10]; 
  
  if (allianceRaces.includes(raceId || 0)) {
    return 'Alliance';
  } else if (hordeRaces.includes(raceId || 0)) {
    return 'Horde';
  }
  
  return 'Unknown';
} 
import { NextResponse } from 'next/server';
import { fetchFromBlizzardApi } from '@/lib/blizzard';
import { Realm, RealmResponse } from '@/types/wow';

export async function GET() {
  try {
    // First fetch all realms 
    const realmsData = await fetchFromBlizzardApi(
      'https://eu.api.blizzard.com/data/wow/realm/index?locale=en_GB',
      'dynamic-classic1x-eu' // Using the Anniversary namespace
    );
    
    // Filter for anniversary servers
    if (realmsData.realms) {
      // Now that we know the structure, we can simplify our filter
      const anniversaryServers = realmsData.realms.filter((realm: Realm) => {
        // The slug is directly available at realm.slug
        return ['thunderstrike', 'spineshatter', 'soulseeker'].includes(realm.slug);
      });
      
      const response: RealmResponse = { realms: anniversaryServers };
      return NextResponse.json(response);
    }
    
    return NextResponse.json(realmsData);
  } catch (error) {
    console.error('Error fetching WoW realms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch WoW realms' },
      { status: 500 }
    );
  }
}

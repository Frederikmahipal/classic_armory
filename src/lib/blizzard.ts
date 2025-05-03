// Utility functions for Blizzard API

/**
 * Get an OAuth token for Blizzard API
 */
export async function getBlizzardToken() {
  const BLIZZARD_CLIENT_ID = process.env.BLIZZARD_CLIENT_ID;
  const BLIZZARD_CLIENT_SECRET = process.env.BLIZZARD_CLIENT_SECRET;
  
  if (!BLIZZARD_CLIENT_ID || !BLIZZARD_CLIENT_SECRET) {
    throw new Error('Missing Blizzard API credentials');
  }
  
  const response = await fetch('https://eu.battle.net/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: BLIZZARD_CLIENT_ID,
      client_secret: BLIZZARD_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get Blizzard access token');
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Fetch data from Blizzard API with authentication
 */
export async function fetchFromBlizzardApi(url: string, namespace: string) {
  const accessToken = await getBlizzardToken();
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Battlenet-Namespace': namespace,
    },
  });

  if (!response.ok) {
    throw new Error(`Blizzard API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get detailed information about a specific realm
 */
export async function getRealmDetails(realmSlug: string) {
  return fetchFromBlizzardApi(
    `https://eu.api.blizzard.com/data/wow/realm/${realmSlug}?locale=en_GB`,
    'dynamic-classic1x-eu'
  );
} 
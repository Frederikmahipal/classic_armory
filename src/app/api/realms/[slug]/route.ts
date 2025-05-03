import { NextRequest, NextResponse } from 'next/server';
import { getRealmDetails } from '@/lib/blizzard';
import { Realm } from '@/types/wow';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Realm slug is required' },
        { status: 400 }
      );
    }
    
    const realmDetails = await getRealmDetails(slug);
    return NextResponse.json(realmDetails as Realm);
  } catch (error) {
    console.error(`Error fetching realm details:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch realm details' },
      { status: 500 }
    );
  }
} 
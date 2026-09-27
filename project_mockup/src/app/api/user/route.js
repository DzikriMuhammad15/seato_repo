import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../lib/prisma';

export async function GET() {
  try {
    const user = await prismaClient.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Format the response to match the expected structure
    const userProfile = {
      initials: user.initials,
      name: user.name,
      email: user.email,
      stats: {
        reservasi: user.statsReservasi,
        ulasan: user.statsUlasan,
        favorit: user.statsFavorit
      },
      location: user.location
    };
    
    return NextResponse.json(userProfile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

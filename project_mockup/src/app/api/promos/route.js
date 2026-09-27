import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    
    let whereClause = {};
    if (restaurantId) {
      whereClause = {
        OR: [
          { type: 'GLOBAL' },
          { restaurantId: restaurantId }
        ]
      };
    }

    const promos = await prismaClient.promo.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(promos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch promos' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../../lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    
    let whereClause = {};
    if (restaurantId) {
      whereClause = { restaurantId };
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

export async function POST(request) {
  try {
    const body = await request.json();
    
    const promo = await prismaClient.promo.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
        color: body.color || 'linear-gradient(135deg, #1B3461 0%, #0EA5A0 100%)',
        type: body.type || 'GLOBAL',
        code: body.code || null,
        restaurantId: body.restaurantId || null
      }
    });

    return NextResponse.json(promo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create promo' }, { status: 500 });
  }
}

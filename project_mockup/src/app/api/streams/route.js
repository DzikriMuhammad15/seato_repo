import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../lib/prisma';

export async function GET(request) {
  try {
    const streams = await prismaClient.stream.findMany({
      where: { parentId: null }, // Only fetch top-level streams
      include: {
        restaurant: {
          select: { name: true }
        },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            restaurant: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(streams);
  } catch (error) {
    console.error('[GET /api/streams] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch streams' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, content, restaurantId, parentId } = body;

    if (!userId || !content) {
      return NextResponse.json({ error: 'Missing userId or content' }, { status: 400 });
    }

    // Fetch user for author info
    const user = await prismaClient.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create stream
    const newStream = await prismaClient.stream.create({
      data: {
        authorName: user.name,
        authorAvatar: user.initials,
        type: 'USER_POST',
        content,
        restaurantId: restaurantId || null,
        parentId: parentId || null
      }
    });

    // Handle trending logic if a restaurant is tagged
    if (restaurantId) {
      const restaurant = await prismaClient.restaurant.findUnique({ where: { id: restaurantId } });
      if (restaurant) {
        const newMentions = restaurant.mentionsCount + 1;
        // Simple algorithm: if mentions > 5, it becomes trending
        const isTrending = newMentions > 5;
        
        await prismaClient.restaurant.update({
          where: { id: restaurantId },
          data: {
            mentionsCount: newMentions,
            isTrending: isTrending || restaurant.isTrending
          }
        });
      }
    }

    return NextResponse.json(newStream, { status: 201 });
  } catch (error) {
    console.error('[POST /api/streams] Error:', error);
    return NextResponse.json({ error: 'Failed to create stream post' }, { status: 500 });
  }
}

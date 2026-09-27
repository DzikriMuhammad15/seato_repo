import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const promo = await prismaClient.promo.findUnique({
      where: { id },
      include: {
        restaurant: {
          include: {
            areas: true
          }
        }
      }
    });

    if (!promo) {
      return NextResponse.json({ error: 'Promo not found' }, { status: 404 });
    }

    // Compute occupancy data if restaurant exists
    let restaurantData = null;
    if (promo.restaurant) {
      const r = promo.restaurant;
      let totalSeats = 0;
      let filledSeats = 0;

      r.areas.forEach(a => {
        totalSeats += a.total;
        filledSeats += a.seatoOccupied + a.walkInOccupied;
      });

      restaurantData = {
        id: r.id,
        name: r.name,
        address: r.address,
        city: r.city,
        distance: r.distance,
        type: r.type,
        rating: r.rating,
        reviewsCount: r.reviewsCount,
        status: r.status,
        imageUrl: r.imageUrl,
        tags: r.tags,
        isTrending: r.isTrending,
        isRecommended: r.isRecommended,
        areas: r.areas,
        occupancy: {
          total: totalSeats,
          filled: filledSeats
        }
      };
    }

    return NextResponse.json({
      id: promo.id,
      title: promo.title,
      subtitle: promo.subtitle,
      imageUrl: promo.imageUrl,
      color: promo.color,
      type: promo.type,
      code: promo.code,
      restaurantId: promo.restaurantId,
      restaurant: restaurantData
    });
  } catch (error) {
    console.error('[GET /api/promos/:id] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch promo' }, { status: 500 });
  }
}

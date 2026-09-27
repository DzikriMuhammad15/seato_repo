import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../lib/prisma';

function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const nearby = searchParams.get('nearby') === 'true';
    const userLat = parseFloat(searchParams.get('lat')) || -6.1154; // default Swasembada
    const userLng = parseFloat(searchParams.get('lng')) || 106.8837;

    const restaurants = await prismaClient.restaurant.findMany({
      include: {
        areas: true
      }
    });
    
    let mapped = restaurants.map(r => {
      let filled = 0;
      let total = 0;
      
      if (r.areas && r.areas.length > 0) {
        r.areas.forEach(a => {
          total += a.total;
          filled += a.seatoOccupied + a.walkInOccupied;
        });
      } else {
        total = 20;
        filled = 10;
      }

      // calculate distance if coordinates exist
      let distVal = 999;
      if (r.latitude && r.longitude) {
        distVal = calculateDistance(userLat, userLng, r.latitude, r.longitude);
      }

      return {
        ...r,
        tags: r.tags ? JSON.parse(r.tags) : [],
        occupancy: { filled, total, waitlist: 0, waitTime: 0 },
        calculatedDistance: distVal
      };
    });

    if (nearby) {
      mapped = mapped.filter(r => r.calculatedDistance <= 10);
      mapped.sort((a, b) => a.calculatedDistance - b.calculatedDistance);
    }

    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newRestaurant = await prismaClient.restaurant.create({
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        type: body.type,
        status: body.status,
        tags: JSON.stringify(body.tags || []),
      }
    });
    return NextResponse.json(newRestaurant, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create restaurant' }, { status: 500 });
  }
}

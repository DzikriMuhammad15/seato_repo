import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../../lib/prisma';

async function checkAutoTerminate(reservations) {
  const now = new Date();
  const updatedReservations = [];

  for (const res of reservations) {
    if (res.status === 'Confirmed') {
      try {
        let timeStr = res.time;
        if (timeStr.includes('WIB')) timeStr = timeStr.replace('WIB', '').trim();
        
        const resDate = new Date(`${res.date}T${timeStr}:00+07:00`); 
        
        if (!isNaN(resDate.getTime())) {
          const diffMins = (now.getTime() - resDate.getTime()) / (1000 * 60);
          const updateDiffMins = (now.getTime() - new Date(res.updatedAt).getTime()) / (1000 * 60);

          if (diffMins > 15 && updateDiffMins > 1) {
            const updated = await prismaClient.reservation.update({
              where: { id: res.id },
              data: { 
                status: 'Dibatalkan', 
                cancelReason: 'Terlambat / No Show (Otomatis)',
                cancelledBy: 'system'
              },
              include: { restaurant: true, user: true, promo: true }
            });
            
            // Free up seatoOccupied on the correct area using areaId
            if (res.areaId) {
              const area = await prismaClient.restaurantArea.findUnique({ where: { id: res.areaId } });
              if (area && area.seatoOccupied > 0) {
                await prismaClient.restaurantArea.update({
                  where: { id: area.id },
                  data: { seatoOccupied: area.seatoOccupied - 1 }
                });
              }
            }
            
            updatedReservations.push(updated);
            continue;
          }
        }
      } catch (e) {}
    }
    updatedReservations.push(res);
  }
  return updatedReservations;
}

export async function GET(request) {
  try {
    // Support filtering by restaurantId query param
    const url = new URL(request.url);
    const restaurantId = url.searchParams.get('restaurantId');

    const whereClause = {};
    if (restaurantId) {
      whereClause.restaurantId = restaurantId;
    }

    let reservations = await prismaClient.reservation.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { restaurant: true, user: true, promo: true, area: true }
    });
    
    reservations = await checkAutoTerminate(reservations);
    
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('[GET /api/admin/reservations] Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

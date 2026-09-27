import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const restaurantId = resolvedParams.id;
    const url = new URL(request.url);
    const date = url.searchParams.get('date');

    console.log(`[API /availability] Request received for restaurant: ${restaurantId}, date: ${date}`);

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Fetch restaurant areas to know the capacity
    const areas = await prismaClient.restaurantArea.findMany({
      where: { restaurantId }
    });

    // Fetch reservations for this date (only active ones)
    const reservations = await prismaClient.reservation.findMany({
      where: {
        restaurantId,
        date,
        status: { in: ['Confirmed', 'Menunggu Konfirmasi'] }
      }
    });

    // We will generate time slots from 12:00 to 21:00
    const times = [];
    for (let i = 12; i <= 21; i++) {
      const h = i.toString().padStart(2, '0');
      times.push(`${h}:00`);
      if (i < 21) times.push(`${h}:30`);
    }

    // Calculate availability per time slot
    const availability = times.map(time => {
      let totalAvailable = 0;
      const areaAvailability = {};

      const todayStr = new Date().toISOString().split('T')[0];

      areas.forEach(area => {
        const bookedCount = reservations.filter(r => 
          r.time === time && (r.areaId === area.id || r.tableType === area.name)
        ).length;
        
        let effectiveAllocated = area.seatoAllocated;
        
        // Integrasi Real-Time Resto App: 
        // Jika pelanggan memesan untuk HARI INI, kita harus memperhitungkan pengunjung Walk-in 
        // yang meluber, dan juga pengunjung Seato yang SEDANG MAKAN saat ini (seatoOccupied).
        if (date === todayStr) {
          const areaWalkInQuota = area.total - area.seatoAllocated;
          const overflowCount = Math.max(0, area.walkInOccupied - areaWalkInQuota);
          // Kurangi kuota dengan meja yang saat ini sedang diduduki (seatoOccupied) dan walk-in overflow
          effectiveAllocated = Math.max(0, area.seatoAllocated - area.seatoOccupied - overflowCount);
        }

        // Available is effectiveAllocated minus any future reservations for this exact time
        const availableInArea = Math.max(0, effectiveAllocated - bookedCount);
        
        areaAvailability[area.id] = {
          name: area.name,
          allocated: area.seatoAllocated,
          effectiveAllocated: effectiveAllocated,
          booked: bookedCount,
          available: availableInArea
        };

        totalAvailable += availableInArea;
      });

      return {
        time,
        totalAvailable,
        isFull: totalAvailable === 0,
        areas: areaAvailability
      };
    });

    return NextResponse.json({ success: true, date, availability });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

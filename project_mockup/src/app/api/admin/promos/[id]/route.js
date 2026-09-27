import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../../../lib/prisma';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prismaClient.promo.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete promo' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const promo = await prismaClient.promo.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        imageUrl: body.imageUrl,
        color: body.color,
        type: body.type,
        code: body.code,
        restaurantId: body.restaurantId
      }
    });

    return NextResponse.json(promo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update promo' }, { status: 500 });
  }
}

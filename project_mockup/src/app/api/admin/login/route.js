import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const restaurant = await prismaClient.restaurant.findUnique({
      where: { loginEmail: email }
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (restaurant.loginPassword !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // In a real app we'd use JWT/sessions. Here we just return the restaurant ID.
    return NextResponse.json({ 
      success: true, 
      restaurantId: restaurant.id,
      name: restaurant.name
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

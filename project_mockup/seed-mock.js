import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create or Update Users
  const mockUsers = [
    { name: 'Bagus', email: 'bagus@example.com', password: 'password123', initials: 'BG', location: 'Bandung', latitude: -6.1154, longitude: 106.8837 },
    { name: 'Giffard', email: 'giffard@example.com', password: 'password123', initials: 'GF', location: 'Jakarta', latitude: -6.2000, longitude: 106.8166 },
    { name: 'Dandy', email: 'dandy@example.com', password: 'password123', initials: 'DD', location: 'Surabaya', latitude: -7.2504, longitude: 112.7688 },
    { name: 'Arif', email: 'arif@example.com', password: 'password123', initials: 'AR', location: 'Yogyakarta', latitude: -7.7956, longitude: 110.3695 }
  ];

  for (const u of mockUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: u,
      create: u
    });
  }

  console.log('Users synced:', mockUsers.map(u => u.name).join(', '));

  // Clear existing restaurants to avoid duplicates if we want clean data, 
  // Delete dependencies first
  await prisma.reservation.deleteMany({});
  await prisma.promo.deleteMany({});
  await prisma.restaurantArea.deleteMany({});
  await prisma.restaurant.deleteMany({});

  const mockRestaurants = [
    {
      name: "Kopi Senja Swasembada",
      address: "Jl. Swasembada Timur No. 10",
      city: "Jakarta Utara",
      type: "Cafe",
      status: "Tersedia",
      rating: 4.8,
      reviewsCount: 120,
      latitude: -6.1140,
      longitude: 106.8840,
      tags: JSON.stringify(["WFC friendly", "Smoking Indoor"]),
      isTrending: true,
      isRecommended: true,
      imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "The Harbor Fine Dining",
      address: "Jl. R.E. Martadinata No. 5",
      city: "Jakarta Utara",
      type: "Fine Dining",
      status: "Tersedia",
      rating: 4.9,
      reviewsCount: 85,
      latitude: -6.1200,
      longitude: 106.8750,
      tags: JSON.stringify(["Fine dining", "Rooftop"]),
      isTrending: false,
      isRecommended: true,
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Warung 24 Jam Priok",
      address: "Jl. Enggano Raya",
      city: "Jakarta Utara",
      type: "Warung",
      status: "Ramai",
      rating: 4.5,
      reviewsCount: 300,
      latitude: -6.1100,
      longitude: 106.8800,
      tags: JSON.stringify(["24 hours", "late night", "Smoking Indoor"]),
      isTrending: false,
      isRecommended: false,
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Paws & Coffee",
      address: "Jl. Yos Sudarso",
      city: "Jakarta Utara",
      type: "Cafe",
      status: "Tersedia",
      rating: 4.7,
      reviewsCount: 90,
      latitude: -6.1250,
      longitude: 106.8900,
      tags: JSON.stringify(["Pets friendly", "WFC friendly"]),
      isTrending: false,
      isRecommended: true,
      imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Roastery Baru",
      address: "Jl. Sunter Karya",
      city: "Jakarta Utara",
      type: "Cafe",
      status: "Tersedia",
      rating: 4.6,
      reviewsCount: 15,
      latitude: -6.1350,
      longitude: 106.8750,
      tags: JSON.stringify(["new commers", "WFC friendly"]),
      isTrending: true,
      isRecommended: false,
      imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Midnight Vibes Cafe",
      address: "Jl. Danau Sunter",
      city: "Jakarta Utara",
      type: "Cafe",
      status: "Penuh",
      rating: 4.8,
      reviewsCount: 210,
      latitude: -6.1400,
      longitude: 106.8650,
      tags: JSON.stringify(["late night", "Smoking Indoor"]),
      isTrending: false,
      isRecommended: true,
      imageUrl: "https://images.unsplash.com/photo-1572116469696-ed1f49fa5eb9?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Steakhouse 88",
      address: "Jl. Boulevard Barat Kelapa Gading",
      city: "Jakarta Utara",
      type: "Fine Dining",
      status: "Tersedia",
      rating: 4.9,
      reviewsCount: 400,
      latitude: -6.1500,
      longitude: 106.8950,
      tags: JSON.stringify(["Fine dining", "Pets friendly"]),
      isTrending: true,
      isRecommended: true,
      imageUrl: "https://images.unsplash.com/photo-1544025162-83b3e2136e7d?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Suntea Station",
      address: "Jl. Gaya Motor",
      city: "Jakarta Utara",
      type: "Beverage",
      status: "Tersedia",
      rating: 4.4,
      reviewsCount: 50,
      latitude: -6.1300,
      longitude: 106.8820,
      tags: JSON.stringify(["new commers", "24 hours"]),
      isTrending: false,
      isRecommended: false,
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800"
    }
  ];

  for (const resto of mockRestaurants) {
    await prisma.restaurant.create({
      data: {
        ...resto,
        areas: {
          create: [
            { name: "Indoor Area", total: 20, seatoAllocated: 10, seatoOccupied: 5, walkInOccupied: 2 },
            { name: "Smoking Area", total: 15, seatoAllocated: 5, seatoOccupied: 3, walkInOccupied: 5 }
          ]
        }
      }
    });
  }

  // Create Promos
  await prisma.promo.createMany({
    data: [
      {
        title: "Diskon 50% di Kopi Senja",
        subtitle: "Spesial WFC dari jam 09:00 - 14:00",
        imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800",
        color: "#1e3a8a",
        type: "GLOBAL"
      },
      {
        title: "Buy 1 Get 1 Free",
        subtitle: "Hanya untuk dine-in di The Harbor",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
        color: "#b91c1c",
        type: "COLLAB"
      }
    ]
  });

  console.log('Seeded restaurants, areas, and promos with precise tags and coordinates!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

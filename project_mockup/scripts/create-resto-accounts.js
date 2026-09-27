import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const restaurants = await prisma.restaurant.findMany();
  
  for (let i = 0; i < restaurants.length; i++) {
    const r = restaurants[i];
    const rawName = r.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const email = `${rawName}@resto.com`;
    const password = 'password123';

    try {
      await prisma.restaurant.update({
        where: { id: r.id },
        data: {
          loginEmail: email,
          loginPassword: password
        }
      });
      console.log(`Updated ${r.name} -> Email: ${email} | Password: ${password}`);
    } catch (e) {
      console.log(`Failed to update ${r.name}, maybe email ${email} already exists?`);
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect(); });

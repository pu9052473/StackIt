const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const packages = [
    {
      name: 'Starter',
      price: 499,
      features: ['1 project', 'Basic support', 'Community access'],
    },
    {
      name: 'Pro',
      price: 999,
      features: ['5 projects', 'Priority support', 'Team access'],
    },
    {
      name: 'Enterprise',
      price: 1999,
      features: ['Unlimited projects', 'Dedicated manager', 'Custom features'],
    },
  ];

  for (const pack of packages) {
    await prisma.package.create({
      data: pack,
    });
  }

  console.log('Packages seeded successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

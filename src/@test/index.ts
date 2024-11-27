import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({ data: { email: "user@test1.com", }, });
  const users = await prisma.user.findMany();
  console.log(users);
}

async function upsert() {
  const users = await prisma.user.upsert({
    where: { email: "user@test5.com" },
    update: { name: "test6" },
    create: { email: "user@test5.com", name: "test5" },
  });
  console.log(users);
}

async function act(callback: () => Promise<void>) {
  callback().then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
}

// exe(main);
act(upsert);

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

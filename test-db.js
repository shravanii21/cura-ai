
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log("MongoDB connected successfully!");

    const count = await prisma.user.count();
    console.log("Total users:", count);
  } catch (error) {
    console.error("Database connection failed:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

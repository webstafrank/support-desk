import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const name = "admin";
  const password = "998877";
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { name },
    update: {
      hashedPassword: hashedPassword,
      role: "admin",
      department: "IT",
    },
    create: {
      name,
      hashedPassword: hashedPassword,
      role: "admin",
      department: "IT",
    },
  });

  console.log("Admin user seeded/updated successfully:", admin.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

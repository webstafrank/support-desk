import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const name = process.env.ADMIN_NAME || "admin";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error("ADMIN_PASSWORD environment variable is required for seeding.");
    process.exit(1);
  }

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

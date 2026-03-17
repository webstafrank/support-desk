import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("--- Hashing Plain Text Passwords ---");
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    if (user.hashedPassword && !user.hashedPassword.startsWith("$2b$") && !user.hashedPassword.startsWith("$2a$")) {
      console.log(`Hashing password for user: ${user.name}`);
      const hashedPassword = await bcrypt.hash(user.hashedPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { hashedPassword },
      });
      console.log(`SUCCESS: Password hashed for user: ${user.name}`);
    } else {
      console.log(`Skipping user: ${user.name} (already hashed or no password)`);
    }
  }
  console.log("--- Hashing Complete ---");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

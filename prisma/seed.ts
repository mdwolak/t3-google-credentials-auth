import { PrismaClient } from "@prisma/client";

import * as userService from "~/server/services/user.service";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: await userService.hashPassword("adminpassword"),
      role: "Admin",
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

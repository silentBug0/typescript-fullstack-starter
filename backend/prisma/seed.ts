import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as bcrypt from 'bcrypt';

async function main() {
  const hashed = await bcrypt.hash('password', 10);
  const user = await prisma.user.create({
    data: {
      name: 'test',
      email: 'test@example.com',
      password: hashed, // <-- Required field
      role: 'user', // <-- Required field (adjust if enum)
      tasks: {
        create: [
          { title: 'Task 1', completed: false },
          { title: 'Task 2', completed: true },
        ],
      },
    },
  });

  console.log('Seeded user with tasks:', user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

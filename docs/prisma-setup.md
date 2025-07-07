// Step 1: Install Prisma CLI and Client
// Run this in your terminal:
// npm install prisma --save-dev
// npm install @prisma/client

// Step 2: Initialize Prisma
// Run this in your terminal:
// npx prisma init

// This creates:
// prisma/
//   schema.prisma   <-- DB schema file
// .env              <-- Database connection URL

// Step 3: Update .env
// Example for PostgreSQL:m
// DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

// Step 4: Define Models in schema.prisma
// prisma/schema.prisma
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  password String
  role     String
  createdAt DateTime @default(now())
}

// Step 5: Run Migration
// npx prisma migrate dev --name init

// Step 6: Generate Prisma Client
// npx prisma generate

// Step 7: Use in NestJS Service
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}

// Step 8: Register PrismaService in a Module
// src/prisma/prisma.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

// Now inject PrismaService into any service
// Example: this.prisma.user.findMany()

//open studio
npx prisma studio
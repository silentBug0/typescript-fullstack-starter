// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.useWebSocketAdapter(new IoAdapter(app)); // ✅ This is CRUCIAL

  await app.listen(3000);
}
bootstrap();

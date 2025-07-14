// src/tasks/tasks.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskEventsGateway } from './task-events.gateway';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [forwardRef(() => PrismaModule)], // if PrismaModule uses forwardRef too
  controllers: [TasksController],
  providers: [
    TasksService,
    TaskEventsGateway, // ✅ Provide the gateway here
  ],
  exports: [TasksService], // ✅ Export if used elsewhere
})
export class TasksModule {}

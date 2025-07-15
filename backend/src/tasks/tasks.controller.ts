import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { Task, User } from '@prisma/client';
import { TaskEventsGateway } from './task-events.gateway';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/auth.controller';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(
    private readonly taskService: TasksService,
    private readonly taskEventsGateway: TaskEventsGateway,
  ) {}
  @Get()
  getAll(): Promise<Task[]> {
    return this.taskService.getAll();
  }

  @Post()
  async create(@Body() data: { title: string; userId: number }) {
    const task: Task = await this.taskService.create(data);
    console.log('Task created:', task);

    this.taskEventsGateway.emitTaskCreated(task); // <--- this notifies frontend
    return task;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllTasks(@CurrentUser() user: User) {
    return this.taskService.getAllTasks(user.id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { title?: string; completed?: boolean; userId: number },
  ) {
    return this.taskService.update(id, body);
  }

  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { userId: number },
  ) {
    return this.taskService.delete(id, body);
  }
}

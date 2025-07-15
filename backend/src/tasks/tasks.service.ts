/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ForbiddenException, Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Task } from '@prisma/client';
import { TaskEventsGateway } from './task-events.gateway';
import { AuthGuard } from '@nestjs/passport';

type CreateTaskInput = {
  title: string;
  userId: number;
};

@Injectable()
@UseGuards(AuthGuard('jwt')) // ✅ this line is crucial
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: TaskEventsGateway,
  ) {}
  getAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      include: {
        user: {
          select: { name: true },
        },
      },
    });
  }
  async create(data: CreateTaskInput): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        title: data.title,
        user: {
          connect: { id: data.userId },
        },
      },
    });

    this.events.emitTaskCreated(task); // 🔁 WebSocket
    return task;
  }

  async update(
    id: number,
    data: { title?: string; completed?: boolean; userId: number },
  ): Promise<Task> {
    const currentTask = await this.prisma.task.findUnique({ where: { id } });

    console.log('Updating task:', id, data, currentTask);

    if (currentTask?.userId !== data.userId) {
      throw new ForbiddenException("You cannot edit/delete others' tasks");
    }

    const task: Task = await this.prisma.task.update({ where: { id }, data });
    this.events.emitTaskUpdated(task);

    return task;
  }

  async delete(id: number, body: { userId: number }) {
    const currentTask = await this.prisma.task.findUnique({ where: { id } });
    console.log('Deleting task:', id, body, currentTask);

    if (currentTask?.userId !== body.userId) {
      throw new ForbiddenException("You cannot edit/delete others' tasks");
    }

    await this.prisma.task.delete({ where: { id } });
    this.events.emitTaskDeleted(id);
  }

  getAllTasks(userId): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

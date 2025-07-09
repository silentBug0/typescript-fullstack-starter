/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  getAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  create(data: { title: string; userId: number }): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: data.title,
        user: {
          connect: { id: data.userId },
        },
      },
    });
  }

  update(
    id: number,
    data: { title?: string; completed?: boolean },
  ): Promise<Task> {
    return this.prisma.task.update({ where: { id }, data });
  }

  delete(id: number): Promise<Task> {
    return this.prisma.task.delete({ where: { id } });
  }
}

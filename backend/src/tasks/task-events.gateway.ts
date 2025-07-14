import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
@Injectable()
export class TaskEventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => TasksService))
    private readonly tasksService: TasksService,
  ) {
    console.log('✅ TaskEventsGateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`🟢 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔴 Client disconnected: ${client.id}`);
  }

  // 🔁 Called by TasksService after task is created
  emitTaskCreated(task: Task) {
    this.server.emit('taskCreated', task);
  }

  emitTaskUpdated(task: Task) {
    this.server.emit('taskUpdated', task);
  }

  emitTaskDeleted(id: number) {
    this.server.emit('taskDeleted', id);
  }

  // 📤 Send all tasks when requested
  @SubscribeMessage('getTasks')
  async handleGetTasks() {
    const tasks = await this.tasksService.getAll();
    this.server.emit('tasks', tasks);
  }
}

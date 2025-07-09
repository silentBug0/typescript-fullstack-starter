// tasks.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TasksService } from './tasks.service'; // ✅ Make sure this is imported correctly
import { Inject } from '@nestjs/common';

@WebSocketGateway()
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(TasksService)
    private readonly tasksService: TasksService, // ✅ Typing is safe here
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Example method
  async broadcastTasks() {
    const tasks = await this.tasksService.getAll();
    this.server.emit('tasks', tasks);
  }
}

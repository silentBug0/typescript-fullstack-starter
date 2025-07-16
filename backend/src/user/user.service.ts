import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// src/user/user.service.ts
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true }, // only needed fields
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(dto: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role ?? 'user',
      },
    });
  }

  async changeRole(
    targetUserId: number,
    newRole: 'admin' | 'user',
    currentUserId: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(targetUserId) },
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.role === newRole) {
      throw new BadRequestException(`User already has role "${newRole}"`);
    }

    if (user.id === currentUserId && newRole !== 'admin') {
      throw new BadRequestException('Admins cannot demote themselves');
    }

    return this.prisma.user.update({
      where: { id: Number(targetUserId) },
      data: { role: newRole },
    });
  }

  deleteUser(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}

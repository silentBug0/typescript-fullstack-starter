/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from '../dto/update-profile.dto';

interface User {
  id: number;
  email: string;
  role: string;
  password?: string; // Optional for validation
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<{ [key: string]: any }, 'password'> | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const { password: _, ...result } = user;
      return result as Omit<typeof user, 'password'>;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Validation error:', error.message);
      } else {
        console.error('Unknown error during validation:', error);
      }

      throw new UnauthorizedException('Login failed');
    }
  }

  login(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: payload, // Include user info in response
    };
  }

  // 👇 Add this method
  generateToken(user: User): { accessToken: string } {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<{ accessToken: string }> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('User already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashed, role: 'user', name },
    });

    return this.generateToken(user);
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const data: any = {};

    if (dto.name) data.name = dto.name;
    if (dto.password) data.password = await bcrypt.hash(dto.password, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}

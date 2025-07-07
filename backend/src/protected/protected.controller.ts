// src/protected/protected.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// auth/jwt-payload.interface.ts
export interface JwtPayload {
  email: string;
  role: string;
}

@Controller('protected')
export class ProtectedController {
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProfile(@Request() req: Request & { user: JwtPayload }) {
    return {
      message: 'You accessed a protected route!',
      user: req.user,
    };
  }
}

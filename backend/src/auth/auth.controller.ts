import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    if (email && password) {
      return {
        token: 'mock-token-123',
        user: {
          email,
        },
      };
    } else {
      return { message: 'Invalid credentials' };
    }
  }
}

import { Body, Controller, Post, UnauthorizedException, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthGuard } from '@nestjs/passport';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);

    await sleep(1000);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    return this.authService.login(user);
  }
  @Post('register')
  async register(@Body() { email, password, name }: RegisterDto): Promise<{ accessToken: string }> {
    return this.authService.register(email, password, name);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req: any) {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return {
      id: req?.user?.id,
      email: req?.user?.email,
      role: req?.user?.role,
      name: req?.user?.name, // optional
    }; // req.user is populated by JwtStrategy
  }
}

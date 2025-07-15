import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
  Get,
  Req,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
// function sleep(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    // await sleep(1000);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    return this.authService.login(user);
  }
  @Post('register')
  async register(
    @Body() { email, password, name }: RegisterDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.register(email, password, name);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req: any) {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */

    return {
      id: req?.user?.id,
      email: req?.user?.email,
      role: req?.user?.role,
      name: req?.user?.name, // optional
    }; // req.user is populated by JwtStrategy
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(user.id, dto);
  }
}

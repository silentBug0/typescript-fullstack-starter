import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtStrategy)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}

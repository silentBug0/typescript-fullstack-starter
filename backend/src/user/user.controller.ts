import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express'; // ✅ alias it

function getUser(req: ExpressRequest): Express.User {
  if (!req.user) throw new UnauthorizedException();
  return req.user;
}

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard) // ✅ Fix is here
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  // @Roles('admin') // ✅ This now works because AuthGuard injects `req.user`
  getAllUsers() {
    return this.userService.findAll();
  }

  @Post()
  @Roles('admin')
  createUser(
    @Body()
    CreateUserDto: {
      name: string;
      email: string;
      password: string;
      role: 'user' | 'admin';
    },
  ) {
    return this.userService.createUser(CreateUserDto);
  }

  @Patch(':id/role')
  @Roles('admin')
  changeUserRole(
    @Param('id') userId: number,
    @Body('role') role: 'user' | 'admin',
    @Req() req: ExpressRequest, // ✅ use ExpressRequest type
  ) {
    const user = getUser(req);
    return this.userService.changeRole(Number(userId), role, user.id);
  }

  @Delete(':id')
  @Roles('admin')
  deleteUser(@Param('id') userId: number) {
    return this.userService.deleteUser(Number(userId));
  }
}

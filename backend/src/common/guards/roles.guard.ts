import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express'; // ✅ import this

import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../user/role.enum'; // or wherever your Role enum is

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<Request>(); // ✅ typed
    const user = request.user as Express.User;

    if (!user) throw new UnauthorizedException('User not authenticated');

    return requiredRoles.includes(user.role); // ✅ match user role
  }
}

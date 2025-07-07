/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtStrategyBase } from 'passport-jwt';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(JwtStrategyBase) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key', // 🔐 Replace with env var
    });
  }

  validate(payload: JwtPayload) {
    // This becomes req.user in route handlers
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}

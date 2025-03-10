/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true; // ถ้าไม่มี Role ที่กำหนดไว้ ให้ผ่านเลย

    const { user } = context.switchToHttp().getRequest(); // ดึง req.user
    return requiredRoles.includes(user.role); // ตรวจสอบว่า role ของ user ตรงกับที่กำหนดหรือไม่
  }
}

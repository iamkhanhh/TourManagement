import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('request: ', request);
    const userRole = request.session?.role;

    if (!userRole) {
      throw new UnauthorizedException('Role not found in session');
    }

    if (userRole !== 'admin') {
      throw new UnauthorizedException('Access denied. Admins only.');
    }

    return true;
  }
}
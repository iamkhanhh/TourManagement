import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ProviderGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userRole = request.user?.userRole;

    if (!userRole) {
      throw new UnauthorizedException('Role not found in session');
    }

    // Cho phép cả 'admin' và 'provider' truy cập
    if (userRole !== 'admin' && userRole !== 'provider') {
      throw new UnauthorizedException('Access denied. Admin or provider only.');
    }

    return true;
  }
}
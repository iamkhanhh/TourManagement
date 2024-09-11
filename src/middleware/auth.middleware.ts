import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';

// interface CustomSessionData {
//   userID?: string;
//   username?: string;
//   role?: string;
// }

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
  ) {}

  async use(req: Request | any, res: Response, next: NextFunction) {
    const excludedPaths = ['/', '/auth/login', '/auth/signup', '/thu'];

    const path = req.originalUrl.split('?')[0];
    // Kiểm tra nếu đường dẫn hiện tại là một trong những đường dẫn cần loại trừ
    if (excludedPaths.includes(path)) {
      return next();
    }

    const access_token = req.cookies['access_token'];
    if (!access_token) {
      return res.redirect('/auth/login');
    }
    const decodedToken = await this.jwtService.verifyAsync(access_token, { secret: process.env.JWT_SECRET_KEY })
    
    req.user = { ...decodedToken };
    next();
  }
}

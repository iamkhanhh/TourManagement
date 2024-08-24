import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';

interface CustomSessionData {
  userID?: string;
  username?: string;
  role?: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: Request & { session: CustomSessionData }, res: Response, next: NextFunction) {
    const excludedPaths = ['/', '/login', '/signup'];

    // Kiểm tra nếu đường dẫn hiện tại là một trong những đường dẫn cần loại trừ
    if (excludedPaths.includes(req.path)) {
      return next();
    }

    const access_token = req.cookies['access_token'];
    if (!access_token) {
      return res.redirect('/log-in');
    }
    const decodedToken = await this.authService.verifyToken(access_token);
    req.session = { ...req.session, ...decodedToken };
    next();
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface CustomSessionData {
  userID?: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request & { session: CustomSessionData }, res: Response, next: NextFunction) {
    const excludedPaths = ['/', '/login', '/signup'];

    // Kiểm tra nếu đường dẫn hiện tại là một trong những đường dẫn cần loại trừ
    if (excludedPaths.includes(req.path)) {
      return next();
    }

    const cookie = req.cookies['access_token'];
    if (!cookie) {
      return res.redirect('/log-in');
    }
    next();
  }
}

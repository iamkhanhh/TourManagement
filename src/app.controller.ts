import { Controller, Get, Redirect, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('home')
  getHello() {
    return
  }

  @Get('/log-out')
  @Redirect('auth/log-in')
  async logout(@Req() req: Request, @Res({passthrough: true}) res: Response) {
    await res.clearCookie('access_token');
    return;
  }
}

import { Controller, Get, Redirect, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/log-out')
  @Redirect('/auth/login')
  async logout(@Req() req: Request, @Res({passthrough: true}) res: Response) {
    await res.clearCookie('access_token');
    return;
  }

  @Get()
  @Render('home')
  async getHello(@Req() req: Request) {
    var userName;
    if (req.cookies['access_token']) {
      var data = await this.appService.verifyToken(req.cookies['access_token']);
      userName = data.userName
    }
    return {
      showHeader: true,
      showFooter: true,
      userName
    }
  }
}

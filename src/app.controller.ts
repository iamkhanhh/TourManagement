import { Controller, Get, Redirect, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/log-out')
  @Redirect('auth/log-in')
  async logout(@Req() req: Request, @Res({passthrough: true}) res: Response) {
    await res.clearCookie('access_token');
    return;
  }

  @Get()
  @Render('home')
  getHello() {
    return {
      message: this.appService.getHello()
    }
  }

  @Get('login')
  @Render('auth/login')
  getHello1() {
    return {
      message: this.appService.getHello()
    }
  }


  @Get('signup')
  @Render('auth/signup')
  getHello2() {
    return {
      message: this.appService.getHello()
    }
  }
}

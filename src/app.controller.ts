import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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

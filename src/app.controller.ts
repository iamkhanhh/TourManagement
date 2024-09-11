import { Body, Controller, Get, Post, Redirect, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { UpdateAccDto } from './dto/updateAcc.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/log-out')
  @Redirect('/auth/login')
  async logout(@Res({passthrough: true}) res: Response) {
    await res.clearCookie('access_token');
    return;
  }

  @Get('/my-account')
  @Render('myAccount')
  async myAccount(@Req() req: Request | any) {
    var data = await this.appService.myAccount(req.user?.userID);
    var isProvider, isAdmin;
    if (req.user.userRole == 'provider') {
      isProvider = true;
    } else if (req.user.userRole == 'admin') {
      isAdmin = true;
    }
    return {...data, userName: req.user.userName, isAdmin, isProvider}
  }

  @Get('thu')
  thu(
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const data = this.appService.getBooks();
      return data;
    } catch (error) {
      console.error('Error retrieving cart:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  @Post('update-account')
  @Redirect('/my-account')
  async updateAccount(
    @Req() req: Request | any,
    @Body() updateAccDto: UpdateAccDto
  ) {
    await this.appService.updateAccount(updateAccDto, req.user?.userID);
  }

  @Get()
  @Render('home')
  async getHello(@Req() req: Request | any) {
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

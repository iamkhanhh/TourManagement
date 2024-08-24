import { Body, Controller, Get, Post, Redirect, Render, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Render('auth/login')
  login_get() {

  }

  @Post('log-in')
  @Redirect('/')
  async login(
    @Body() loginDto: any,
    @Res({passthrough: true}) res: Response
  ) {
    const token = await this.authService.login(loginDto);
    res.cookie('access_token', token, {httpOnly: true});
  }

  @Get('signup')
  @Render('auth/signup')
  signup_get() {
    
  }

  @Post('sign-up')
  @Redirect('/')
  async signup(
    @Body() signupDto: any,
    @Res({passthrough: true}) res: Response
  ) {
    const token = await this.authService.signUp(signupDto);
    res.cookie('access_token', token, {httpOnly: true});
  }
}

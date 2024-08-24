import { Body, Controller, Get, Post, Redirect, Render, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { LoginDto } from 'src/dto/login.dto';
import { SignUpDto } from 'src/dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Render('auth/login')
  login_get() {

  }

  @Post('login')
  @Redirect('/')
  async login(
    @Body() loginDto: LoginDto,
    @Res({passthrough: true}) res: Response
  ) {
    const token = await this.authService.login(loginDto);
    res.cookie('access_token', token, {httpOnly: true});
  }

  @Get('signup')
  @Render('auth/signup')
  signup_get() {

  }

  @Post('signup')
  @Redirect('/')
  async signup(
    @Body() signupDto: SignUpDto,
    @Res({passthrough: true}) res: Response
  ) {
    const token = await this.authService.signUp(signupDto);
    res.cookie('access_token', token, {httpOnly: true});
  }
}

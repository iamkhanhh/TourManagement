import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {}

  login(loginDto: any) {
    return '123'
  }

  signUp(signupDto: any) {
    return '123'
  }
}

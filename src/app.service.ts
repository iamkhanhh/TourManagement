import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {

  constructor(
    private jwtService: JwtService,
  ) {}

  async verifyToken(access_token: string) {
    return await this.jwtService.verifyAsync(access_token, { secret: process.env.JWT_SECRET_KEY })
  }
}

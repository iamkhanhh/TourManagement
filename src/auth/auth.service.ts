import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/dto/login.dto';
import { SignUpDto } from 'src/dto/signup.dto';
import { Users } from 'src/entities/users.enity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users) private usersRepository: Repository<Users>
  ) {}

  async verifyToken(access_token: string) {
    return await this.jwtService.verifyAsync(access_token, { secret: process.env.JWT_SECRET_KEY })
  }

  async login(loginDto: LoginDto) {
    const data = await this.usersRepository.findOneBy({
      username: loginDto.userName as string,
    })
    
    if (!data) {
      throw new BadRequestException('Invalid credentials !');
    }

    if (!await bcrypt.compare(loginDto.password as string, data.password as string)) {
      throw new HttpException('Password did not match !', 404);
    }

    const accessToken = await this.jwtService.signAsync({userID: data.user_id, userName: data.username, userRole: data.role}, {
      expiresIn: '1d',
    });

    await this.usersRepository.update(
      { user_id: data.user_id },
      { last_login: new Date() }
    );

    return accessToken
  }

  async signUp(signupDto: SignUpDto) {
    const isValidUserName = await this.usersRepository.findOneBy({
      username: signupDto.userName as string,
    })

    if (isValidUserName) {
      throw new BadRequestException('This userName already exists !');
    }

    if (signupDto.password != signupDto.confirmPassword) {
      throw new HttpException('Password did not match !', 404);
    }

    const hashedPassword = await bcrypt.hash(signupDto.password as string, 12);

    const user = new Users();
    user.username = signupDto.userName as string;
    user.password = hashedPassword;
    user.email = signupDto.email as string;
    user.role = signupDto.role as string;
    user.money = 0;
    user.last_login = new Date();
    const userSaved = await this.usersRepository.save(user);

    const payload = { userID: userSaved.user_id, userName: userSaved.username, userRole: userSaved.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    return accessToken
  }
}

import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  readonly userName: String;

  @IsNotEmpty()
  readonly password: String;
}
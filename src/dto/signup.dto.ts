import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class SignUpDto {
  @IsNotEmpty()
  readonly userName: String;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: String;

  @IsNotEmpty()
  @MinLength(6)
  readonly confirmPassword: String;

  @IsNotEmpty()
  readonly role: String;
}
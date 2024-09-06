import { IsNotEmpty } from 'class-validator';

export class UpdateAccDto {
  @IsNotEmpty()
  readonly user_name: String;

  @IsNotEmpty()
  readonly email: String;

  readonly currentPassword: String;

  readonly newPassword: String;

  readonly confirmPassword: String;
}
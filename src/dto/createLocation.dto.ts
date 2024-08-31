import { IsNotEmpty } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  readonly location_name: String;

  readonly description: String;

  @IsNotEmpty()
  readonly address: String;

  readonly coordinates: String;
}
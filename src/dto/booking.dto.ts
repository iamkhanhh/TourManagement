import { IsNotEmpty } from 'class-validator';

export class BookingDto {
  @IsNotEmpty()
  readonly availability: number;

  @IsNotEmpty()
  readonly description: String;
}
import { IsNotEmpty } from 'class-validator';

export class EditTourDto {
  @IsNotEmpty()
  readonly tour_name: String;

  @IsNotEmpty()
  readonly location: String;

  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty()
  readonly availability: String;

  @IsNotEmpty()
  readonly date_start: Date;

  @IsNotEmpty()
  readonly date_end: Date;

  readonly description: String;

  // location
  @IsNotEmpty()
  readonly location_name: String;

  readonly description_location: String;

  readonly address: String;

  readonly coordinates: String;
}
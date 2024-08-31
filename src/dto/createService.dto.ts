import { IsNotEmpty } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  readonly service_name: String;

  readonly description: String;

  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty()
  readonly service_category: String;
}
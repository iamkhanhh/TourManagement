import { IsNotEmpty } from 'class-validator';

export class CommentDto {
  @IsNotEmpty()
  readonly rating: string;

  @IsNotEmpty()
  readonly comment: String;
}
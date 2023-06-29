import { IsNumber, IsString } from 'class-validator';
export class PostRsiDto {
  @IsString()
  date: Date;
  @IsNumber()
  rsi: number;
}

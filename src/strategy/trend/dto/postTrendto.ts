import { IsNumber, IsString } from 'class-validator';
export class PostTrendto {
  @IsString()
  startDate: Date;
  @IsString()
  endDate: Date;
  @IsNumber()
  balance: number;
}

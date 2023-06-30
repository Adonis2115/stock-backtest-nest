import { IsNumber, IsString } from 'class-validator';
export class PostBacktestRsiDto {
  @IsString()
  startDate: Date;
  @IsString()
  endDate: Date;
  @IsNumber()
  rsi: number;
  @IsNumber()
  balance: number;
}

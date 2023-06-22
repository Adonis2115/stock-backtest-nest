import { IsDate, IsNumber, IsString } from 'class-validator';
export class PostStockAndOhlcDto {
  @IsNumber()
  id: number;
  @IsDate()
  fromDate: Date;
  @IsString()
  toDate: Date;
}

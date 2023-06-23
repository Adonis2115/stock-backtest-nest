import { IsNumber, IsString } from 'class-validator';
export class PostStockAndOhlcDto {
  @IsNumber()
  id: number;
  @IsString()
  fromDate: Date;
  @IsString()
  toDate: Date;
}

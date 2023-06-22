import { IsNumber, IsString } from 'class-validator';
export class PostGetStockDataDto {
  @IsNumber()
  id: number;
  @IsString()
  fromDate: string;
  @IsString()
  toDate: string;
}

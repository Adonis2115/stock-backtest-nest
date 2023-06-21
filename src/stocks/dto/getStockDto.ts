import { IsNumber } from 'class-validator';
export class GetStockDto {
  @IsNumber()
  stock: number;
}

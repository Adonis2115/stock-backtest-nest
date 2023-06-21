import { IsString } from 'class-validator';
export class GetStockDto {
  @IsString()
  stock: string;
}

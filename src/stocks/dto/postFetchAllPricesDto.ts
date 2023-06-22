import { IsString } from 'class-validator';
export class PostFetchAllPricesDto {
  @IsString()
  fromDate: string;
  @IsString()
  toDate: string;
}

import { IsString } from 'class-validator';
export class PostTrendto {
  @IsString()
  dateFrom: Date;
  @IsString()
  dateTo: Date;
}

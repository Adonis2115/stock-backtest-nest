import { IsBoolean, IsString } from 'class-validator';
export class PostRsiDto {
  @IsString()
  date: Date;
  @IsBoolean()
  backtest: boolean;
}

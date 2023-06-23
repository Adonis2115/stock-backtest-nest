import { IsBoolean, IsString } from 'class-validator';
export class PostMomentumDto {
  @IsString()
  date: Date;
  @IsBoolean()
  backtest: boolean;
}

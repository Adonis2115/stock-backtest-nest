import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OHLC } from 'src/entities/ohlc.entity';
import { Stock } from 'src/entities/stocks.entity';
import { MomentumService } from 'src/scanner/momentum/momentum.service';
import { TrendController } from './trend.controller';
import { TrendService } from './trend.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, OHLC])],
  controllers: [TrendController],
  providers: [TrendService, MomentumService],
})
export class TrendModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OHLC } from 'src/entities/ohlc.entity';
import { Stock } from 'src/entities/stocks.entity';
import { RsiService } from 'src/scanner/rsi/rsi.service';
import { BacktestRsiController } from './backtest-rsi.controller';
import { BacktestRsiService } from './backtest-rsi.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, OHLC])],
  controllers: [BacktestRsiController],
  providers: [BacktestRsiService, RsiService],
})
export class BacktestRsiModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OHLC } from 'src/entities/ohlc.entity';
import { Stock } from 'src/entities/stocks.entity';
import { RsiController } from './rsi.controller';
import { RsiService } from './rsi.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, OHLC])],
  controllers: [RsiController],
  providers: [RsiService],
})
export class RsiModule {}

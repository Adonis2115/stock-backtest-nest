import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OHLC } from 'src/entities/ohlc.entity';
import { Stock } from 'src/entities/stocks.entity';
import { MomentumController } from './momentum.controller';
import { MomentumService } from './momentum.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, OHLC])],
  controllers: [MomentumController],
  providers: [MomentumService],
})
export class MomentumModule {}

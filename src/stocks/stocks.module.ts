import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from 'src/entities/stocks.entity';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}

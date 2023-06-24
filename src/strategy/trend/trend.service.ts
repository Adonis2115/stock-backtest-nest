import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OHLC } from 'src/entities/ohlc.entity';
import { Stock } from 'src/entities/stocks.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrendService {
  TrendService(dateFrom: Date, dateTo: Date) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Stock) private readonly stockRepo: Repository<Stock>,
    @InjectRepository(OHLC) private readonly ohlcRepo: Repository<OHLC>,
  ) {}

  async trend(dateFrom: Date, dateTo: Date) {
    return 'Trend';
  }
}

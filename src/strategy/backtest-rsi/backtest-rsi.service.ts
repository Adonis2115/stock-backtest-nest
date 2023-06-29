import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OHLC } from 'src/entities/ohlc.entity';
import { Stock } from 'src/entities/stocks.entity';
import { RsiService } from 'src/scanner/rsi/rsi.service';
import { Repository } from 'typeorm';

@Injectable()
export class BacktestRsiService {
  constructor(
    @InjectRepository(Stock) private readonly stockRepo: Repository<Stock>,
    @InjectRepository(OHLC) private readonly ohlcRepo: Repository<OHLC>,
    private readonly rsiService: RsiService,
  ) {}
  async backtestRSI(startDate: Date, endDate: Date, balance: number) {
    return 'Backtest RSI';
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OHLC } from 'src/entities/ohlc.entity';
import { Stock } from 'src/entities/stocks.entity';
import { RSI } from 'technicalindicators';
import { Equal, LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class RsiService {
  constructor(
    @InjectRepository(Stock) private readonly stockRepo: Repository<Stock>,
    @InjectRepository(OHLC) private readonly ohlcRepo: Repository<OHLC>,
  ) {}
  async rsi(date: Date, rsi: number) {
    const stocksAll = await this.stockRepo.find({});
    let rsiValues: StockRSI[] = [];
    for (let i = 0; i < stocksAll.length; i++) {
      const stockOHLC = await this.ohlcRepo.find({
        where: {
          stockId: Equal(stocksAll[i].id),
          time: LessThanOrEqual(date),
        },
      });
      const closeValues = stockOHLC.map((item) => item.close);
      const rsiValue = await getRSI(closeValues);
      if (rsiValue >= rsi) {
        rsiValues.push({
          id: stocksAll[i].id,
          stockName: stocksAll[i].name,
          stockSymbol: stocksAll[i].symbol,
          rsi: rsiValue,
        });
      }
    }
    return rsiValues;
  }
}

async function getRSI(closeValues: number[]) {
  const calculatedRSI = RSI.calculate({ values: closeValues, period: 14 });
  return calculatedRSI[calculatedRSI.length - 1];
}

type StockRSI = {
  id: number;
  stockName: string;
  stockSymbol: string;
  rsi: number;
};

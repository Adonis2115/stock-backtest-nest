import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OHLC } from 'src/entities/ohlc.entity';
import { Stock } from 'src/entities/stocks.entity';
import { CrossUp, RSI } from 'technicalindicators';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class RsiService {
  constructor(
    @InjectRepository(Stock) private readonly stockRepo: Repository<Stock>,
    @InjectRepository(OHLC) private readonly ohlcRepo: Repository<OHLC>,
  ) {}
  async rsi(date: Date, rsi: number) {
    const stocksAll = await this.stockRepo.find({
      where: {
        data: {
          time: LessThanOrEqual(date),
        },
      },
      relations: ['data'],
    });
    let rsiValues: StockRSI[] = [];
    for (let i = 0; i < stocksAll.length; i++) {
      const stockOHLC = stocksAll[i].data;
      const closeValues = stockOHLC.map((item) => item.close);
      const { calculatedRSI, priceAtRSI } = await getRSI(closeValues);
      const rsiCrossValue = Array.from(
        { length: calculatedRSI.length },
        () => rsi,
      );
      const isRsiCross = CrossUp.calculate({
        lineA: calculatedRSI,
        lineB: rsiCrossValue,
      });
      if (isRsiCross[isRsiCross.length - 1]) {
        rsiValues.push({
          id: stocksAll[i].id,
          stockName: stocksAll[i].name,
          stockSymbol: stocksAll[i].symbol,
          rsi: calculatedRSI[calculatedRSI.length - 1],
          price: priceAtRSI,
          date: stockOHLC[stockOHLC.length - 1].time,
        });
      }
    }
    return rsiValues;
  }
}

async function getRSI(closeValues: number[]) {
  const calculatedRSI = RSI.calculate({ values: closeValues, period: 14 });
  return {
    calculatedRSI: calculatedRSI,
    priceAtRSI: closeValues[closeValues.length - 1],
  };
}

type StockRSI = {
  id: number;
  stockName: string;
  stockSymbol: string;
  rsi: number;
  price: number;
  date: Date;
};

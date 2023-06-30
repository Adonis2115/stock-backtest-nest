import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OHLC } from 'src/entities/ohlc.entity';
import { Stock } from 'src/entities/stocks.entity';
import { RsiService } from 'src/scanner/rsi/rsi.service';
import { RSI } from 'technicalindicators';
import { Equal, LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class BacktestRsiService {
  constructor(
    @InjectRepository(Stock) private readonly stockRepo: Repository<Stock>,
    @InjectRepository(OHLC) private readonly ohlcRepo: Repository<OHLC>,
    private readonly rsiService: RsiService,
  ) {}
  async backtestRSI(
    startDate: Date,
    endDate: Date,
    rsi: number,
    balance: number,
  ) {
    let position: StockPosition[] = [];
    const dates = getDates(new Date(startDate), new Date(endDate));
    for (let i = 0; i < dates.length; i++) {
      const scannerStockList = await this.rsiService.rsi(dates[i], rsi);
      const newStocks = scannerStockList.filter(
        (obj1) =>
          !position.some((obj2) => obj2.id === obj1.id && !obj2.closePrice),
      );
      newStocks.map((item) =>
        position.push({
          id: item.id,
          stockName: item.stockName,
          stockSymbol: item.stockSymbol,
          openRsi: item.rsi,
          openPrice: item.price,
          quantity: Math.floor(balance / 10 / item.price),
          openDate: item.date,
        }),
      );
      position.map(async (stock, index) => {
        if (
          !scannerStockList.some((obj2) => obj2.id === stock.id) &&
          !stock.closePrice
        ) {
          const stockOHLC = await this.ohlcRepo.find({
            where: {
              stockId: Equal(stock.id),
              time: LessThanOrEqual(dates[i]),
            },
          });
          const closeValues = stockOHLC.map((item) => item.close);
          const { rsiValue, priceAtRSI } = await getRSI(closeValues);
          if (rsiValue < 55) {
            (position[index].closeRsi = rsiValue),
              (position[index].closePrice = priceAtRSI),
              (position[index].pnl =
                (position[index].closePrice - position[index].openPrice) *
                position[index].quantity),
              (position[index].closeDate = dates[i]);
          } else {
            position[index].pnl =
              (priceAtRSI - position[index].openPrice) *
              position[index].quantity;
          }
        }
      });
    }
    const sum = position.reduce((accumulator, obj) => {
      if (obj.pnl) {
        return accumulator + obj.pnl;
      }
      return accumulator;
    }, 0);
    console.log(sum);
    return position;
  }
}

async function getRSI(closeValues: number[]) {
  const calculatedRSI = RSI.calculate({ values: closeValues, period: 14 });
  return {
    rsiValue: calculatedRSI[calculatedRSI.length - 1],
    priceAtRSI: closeValues[closeValues.length - 1],
  };
}

function getDates(startDate: Date, endDate: Date) {
  var dateArray = [];
  var currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dateArray.push(currentDate.toISOString().slice(0, 10));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

type StockPosition = {
  id: number;
  stockName: string;
  stockSymbol: string;
  openRsi: number;
  closeRsi?: number;
  openPrice: number;
  closePrice?: number;
  quantity: number;
  pnl?: number;
  openDate: Date;
  closeDate?: Date;
};

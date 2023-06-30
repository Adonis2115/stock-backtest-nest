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
        (obj1) => !position.some((obj2) => obj2.id === obj1.id),
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
      // for (let j = 0; j < scannerStockList.length; j++) {
      //   const newStockToAdd = position.find(
      //     (obj) => obj.id !== scannerStockList[j].id,
      //   );
      //   console.log(newStockToAdd);
      // }
    }
    // ! check stock is not already in position for new position
    // ! To exit check stock is in position and satisfies exit RSI
    return position;
  }
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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OHLC } from 'src/entities/ohlc.entity';
import { Stock } from 'src/entities/stocks.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class MomentumService {
  constructor(
    @InjectRepository(Stock) private readonly stockRepo: Repository<Stock>,
    @InjectRepository(OHLC) private readonly ohlcRepo: Repository<OHLC>,
  ) {}
  async momentum(date: Date, backtest: boolean) {
    let fromDate: Date;
    let toDate: Date;
    if (backtest) {
      fromDate = date;
      toDate = getDate12WeeksDate(fromDate, true);
    } else {
      toDate = date;
      fromDate = getDate12WeeksDate(toDate, false);
    }
    const range = {
      where: {
        data: {
          time: Between(fromDate, toDate),
        },
      },
      relations: ['data'],
    };
    const allStocks = await this.stockRepo.find(range);
    const top50 = await top50Function(allStocks);
    return top50;
  }
}

async function top50Function(
  allStocks: Stock[],
): Promise<StockReturn12Weeks[]> {
  const AllStocksWith12WeekReturn: StockReturn12Weeks[] = [];
  for (let i = 0; i < allStocks.length; i++) {
    let stockReturn =
      (allStocks[i].data[allStocks[i].data.length - 1].close -
        allStocks[i].data[0].close) /
      100;
    AllStocksWith12WeekReturn.push({
      name: allStocks[i].name,
      symbol: allStocks[i].symbol,
      return_12_Weeks: stockReturn,
    });
  }
  AllStocksWith12WeekReturn.sort(
    (a, b) => b.return_12_Weeks - a.return_12_Weeks,
  );
  return AllStocksWith12WeekReturn.slice(0, 50);
}

type StockReturn12Weeks = {
  name: string;
  symbol: string;
  return_12_Weeks: number;
  return_4_Weeks?: number;
  return_1_Weeks?: number;
};

function areDates12OrMoreWeeksApart(fromDate: Date, toDate: Date) {
  const date1 = new Date(fromDate);
  const date2 = new Date(toDate);
  const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
  const twelveWeeksInMilliseconds = 12 * millisecondsPerWeek;

  const difference = Math.abs(date1.getTime() - date2.getTime());

  return difference >= twelveWeeksInMilliseconds;
}

function getDate12WeeksDate(dateString: Date, after: boolean) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + (after ? +12 * 7 : -12 * 7));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}` as unknown as Date;
}

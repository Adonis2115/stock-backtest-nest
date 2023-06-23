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
    const range12Weeks = getRange(date, backtest, 12);
    const allStocks12Weeks = await this.stockRepo.find(range12Weeks);
    const top50 = await getTopNStocks(allStocks12Weeks, 50);
    const range4Weeks = getRange(date, backtest, 4);
    const allStocks4Weeks = await this.stockRepo.find(range4Weeks);
    const top30 = await getTopNStocks(allStocks4Weeks, 30, top50);
    const range1Weeks = getRange(date, backtest, 12);
    const allStocks1Weeks = await this.stockRepo.find(range1Weeks);
    const top10 = await getTopNStocks(allStocks1Weeks, 10, top30);
    return top10;
  }
}
function getRange(date: Date, backtest: boolean, weeks: number) {
  let fromDate: Date;
  let toDate: Date;
  if (backtest) {
    fromDate = date;
    toDate = getToAndFromDate(fromDate, backtest, weeks);
  } else {
    toDate = date;
    fromDate = getToAndFromDate(toDate, backtest, weeks);
  }
  const range = {
    where: {
      data: {
        time: Between(fromDate, toDate),
      },
    },
    relations: ['data'],
  };
  return range;
}
async function getTopNStocks(
  allStocks12Weeks: Stock[],
  numberOfStocks: number,
  filterStocks?: StockListReturn[],
): Promise<StockListReturn[]> {
  const AllStocksWith12WeekReturn: StockListReturn[] = [];
  for (let i = 0; i < allStocks12Weeks.length; i++) {
    let stockReturn =
      (allStocks12Weeks[i].data[allStocks12Weeks[i].data.length - 1].close -
        allStocks12Weeks[i].data[0].close) /
      100;
    AllStocksWith12WeekReturn.push({
      name: allStocks12Weeks[i].name,
      symbol: allStocks12Weeks[i].symbol,
      return: stockReturn,
    });
  }
  AllStocksWith12WeekReturn.sort((a, b) => b.return - a.return);
  const topStockList = filterStocks
    ? AllStocksWith12WeekReturn.filter((itemB) =>
        filterStocks.some(
          (itemA) => itemA.name === itemB.name && itemA.symbol === itemB.symbol,
        ),
      ).slice(0, numberOfStocks)
    : AllStocksWith12WeekReturn;
  return topStockList;
}

type StockListReturn = {
  name: string;
  symbol: string;
  return: number;
};

function getToAndFromDate(dateString: Date, backtest: boolean, weeks: number) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + (backtest ? +weeks * 7 : -weeks * 7));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}` as unknown as Date;
}

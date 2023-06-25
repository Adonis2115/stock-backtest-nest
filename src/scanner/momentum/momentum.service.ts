import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OHLC } from 'src/entities/ohlc.entity';
import { Stock } from 'src/entities/stocks.entity';
import { Between, Equal, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class MomentumService {
  constructor(
    @InjectRepository(Stock) private readonly stockRepo: Repository<Stock>,
    @InjectRepository(OHLC) private readonly ohlcRepo: Repository<OHLC>,
  ) {}
  async momentum(date: Date, backtest: boolean) {
    const lastRecord = await this.ohlcRepo.findOne({
      where: {},
      order: { id: 'DESC' },
    });
    // bactest: true or false logic not used properly
    let week12before = getToAndFromDate(date, false, 12);
    const nearestDateAvailable = await this.ohlcRepo.findOne({
      where: {
        stockId: Equal(1),
        time: MoreThanOrEqual(week12before),
      },
    });
    let lastDate =
      week12before >= nearestDateAvailable.time
        ? getToAndFromDate(week12before, true, 12)
        : getToAndFromDate(nearestDateAvailable.time, true, 12);
    const range12Weeks = getRange(lastDate, backtest, 12);
    const allStocks12Weeks = await this.stockRepo.find(range12Weeks);
    const top50 = await getTopNStocks(allStocks12Weeks, 50);
    const range4Weeks = getRange(lastDate, backtest, 4);
    const allStocks4Weeks = await this.stockRepo.find(range4Weeks);
    const top30 = await getTopNStocks(allStocks4Weeks, 30, top50);
    const range1Weeks = getRange(lastDate, backtest, 1);
    const allStocks1Weeks = await this.stockRepo.find(range1Weeks);
    const top10 = await getTopNStocks(allStocks1Weeks, 10, top30);
    return top10;
  }
}

async function getTopNStocks(
  allStocksNWeeks: Stock[],
  numberOfStocks: number,
  filterStocks?: StockListReturn[],
): Promise<StockListReturn[]> {
  const stockListReturn: StockListReturn[] = [];
  for (let i = 0; i < allStocksNWeeks.length; i++) {
    let stockReturn = (
      ((allStocksNWeeks[i].data[allStocksNWeeks[i].data.length - 1].close -
        allStocksNWeeks[i].data[0].close) /
        allStocksNWeeks[i].data[0].close) *
      100
    ).toFixed(2);
    stockListReturn.push({
      stockId: allStocksNWeeks[i].id,
      name: allStocksNWeeks[i].name,
      symbol: allStocksNWeeks[i].symbol,
      return: Number(stockReturn),
      opening:
        allStocksNWeeks[i].data[allStocksNWeeks[i].data.length - 1].close,
      openDate:
        allStocksNWeeks[i].data[allStocksNWeeks[i].data.length - 1].time,
    });
  }
  stockListReturn.sort((a, b) => b.return - a.return);
  const topStockList = filterStocks
    ? stockListReturn
        .filter((itemB) =>
          filterStocks.some((itemA) => itemA.symbol === itemB.symbol),
        )
        .slice(0, numberOfStocks)
    : stockListReturn.slice(0, numberOfStocks);
  return topStockList;
}

type StockListReturn = {
  stockId: number;
  name: string;
  symbol: string;
  returnRs?: number;
  return: number;
  opening: number;
  closing?: number;
  openDate: Date;
  closingDate?: Date;
  quantity?: number;
  invested?: number;
};

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

export function getToAndFromDate(
  dateString: Date,
  backtest: boolean,
  weeks: number,
) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + (backtest ? +weeks * 7 : -weeks * 7));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}` as unknown as Date;
}

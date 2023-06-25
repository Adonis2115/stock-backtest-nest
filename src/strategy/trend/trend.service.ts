import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OHLC } from 'src/entities/ohlc.entity';
import { Stock } from 'src/entities/stocks.entity';
import {
  MomentumService,
  getToAndFromDate,
} from 'src/scanner/momentum/momentum.service';
import { Equal, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class TrendService {
  constructor(
    @InjectRepository(Stock) private readonly stockRepo: Repository<Stock>,
    @InjectRepository(OHLC) private readonly ohlcRepo: Repository<OHLC>,
    private readonly momentumService: MomentumService,
  ) {}

  async trend(startDate: Date, endDate: Date, balance: number) {
    const lastRecord = await this.ohlcRepo.findOne({
      where: {},
      order: { id: 'ASC' },
    });
    let MaxInvestEachStock = balance / 10;
    const startDateFrom =
      new Date(startDate) < lastRecord.time ? lastRecord.time : startDate;
    let toDate = getToAndFromDate(startDateFrom, true, 12); // change this every loop
    let dates = getDates12WeeksApart(toDate, endDate); // bactest starting after 12 weeks correct it fro before if data is present
    let portfolioReturn = [];
    let sum = 0;
    for (let i = 0; i < dates.length; i++) {
      let portfolio = await this.momentumService.momentum(dates[i], true);
      for (let j = 0; j < portfolio.length; j++) {
        const nextWeekPrice = await this.ohlcRepo.findOne({
          where: {
            stockId: Equal(portfolio[j].stockId),
            time: MoreThanOrEqual(dates[i + 1]),
          },
        });
        if (nextWeekPrice) {
          portfolio[j].quantity = Math.floor(
            MaxInvestEachStock / portfolio[j].opening,
          );
          portfolio[j].closing = nextWeekPrice.close;
          let stockReturn = portfolio[j].closing - portfolio[j].opening;
          portfolio[j].return = Number(
            ((stockReturn / portfolio[j].closing) * 100).toFixed(2),
          );
          portfolio[j].returnRs = Number(
            (stockReturn * portfolio[j].quantity).toFixed(2),
          );
          portfolio[j].invested = portfolio[j].quantity * portfolio[j].opening;
          portfolio[j].closingDate = nextWeekPrice.time;
          sum = Number((sum + stockReturn * portfolio[j].quantity).toFixed(2));
        }
      }
      portfolioReturn.push(portfolio);
    }
    console.log(sum);
    return portfolioReturn;
  }
}

function getDates12WeeksApart(startDateString: Date, endDateString: Date) {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return dates;
}

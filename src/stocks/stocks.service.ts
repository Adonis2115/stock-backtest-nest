import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, map } from 'rxjs';
import { OHLC } from 'src/entities/ohlc.entity';
import { Stock } from 'src/entities/stocks.entity';
import { Between, Equal, Repository } from 'typeorm';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(Stock) private readonly stockRepo: Repository<Stock>,
    @InjectRepository(OHLC) private readonly ohlcRepo: Repository<OHLC>,
    private readonly httpService: HttpService,
  ) {}

  async getStock(id: number) {
    return await this.stockRepo.findOne({ where: { id: id } });
  }
  async getAllStock() {
    console.log(new Date());
    return await this.stockRepo.find();
  }
  async getStockAndOhlc(id: number, fromDate: Date, toDate: Date) {
    return await this.stockRepo.findOne({
      where: {
        id: id,
        data: {
          time: Between(fromDate, toDate),
        },
      },
      relations: ['data'],
    });
  }
  async getOhlc(id: number, fromDate: Date, toDate: Date) {
    return await this.ohlcRepo.find({
      where: {
        stockId: Equal(id),
        time: Between(fromDate, toDate),
      },
    });
  }
  async getStockData(
    id: number,
    fromDate: string,
    toDate: string,
  ): Promise<Observable<DhanHistoricalDataResponse>> {
    const stock = await this.stockRepo.findOne({ where: { id: id } });
    const headers = {
      'Content-Type': 'application/json',
      'access-token': process.env.DHAN_TOKEN,
    };
    const data = {
      symbol: stock.symbol,
      exchangeSegment: 'NSE_EQ',
      instrument: 'EQUITY',
      expiryCode: 0,
      fromDate: fromDate,
      toDate: toDate,
    };
    const response = await this.httpService
      .post('https://api.dhan.co/charts/historical', data, { headers })
      .pipe(map((resp) => resp.data));
    return response;
  }
  async fetchAllPrices(fromDate: string, toDate: string) {
    const stocks = await this.stockRepo.find();
    for (let j = 0; j < stocks.length; j++) {
      const data = await this.getStockData(stocks[j].id, fromDate, toDate);
      data.subscribe(
        (data) => {
          if (data.open) {
            const records: OHLC[] = [];
            for (let i = 0; i < data.open.length; i++) {
              const record = new OHLC();
              record.open = data.open[i];
              record.high = data.high[i];
              record.low = data.low[i];
              record.close = data.close[i];
              record.volume = data.volume[i];
              record.time = timeStamp_convertor(data.start_Time[i]);
              record.stockId = stocks[j].id;
              records.push(record);
            }
            this.ohlcRepo.save(records);
          }
          console.log(`Fetched Data for ${stocks[j].name}`);
        },
        (error) => {
          console.log(error);
        },
      );
      await sleep(200);
    }
  }
}

type DhanHistoricalDataResponse = {
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
  start_Time: number;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function timeStamp_convertor(n: number) {
  let offset1 = new Date().getTimezoneOffset();
  let istOffset = 330;
  n = n - (istOffset + offset1) * 60;
  let a = ['1980', '01', '01', '05', '30', '00'];
  let time = new Date(
    Number(a[0]),
    Number(a[1]) - 1,
    Number(a[2]),
    Number(a[3]),
    Number(a[4]),
    Number(a[5]),
  );
  time.setSeconds(n);
  let year = time.getFullYear();
  let month = ('0' + (time.getMonth() + 1)).slice(-2);
  let day = ('0' + time.getDate()).slice(-2);
  let hours = ('0' + time.getHours()).slice(-2);
  let min = ('0' + time.getMinutes()).slice(-2);
  let sec = ('0' + time.getSeconds()).slice(-2);
  let strTime =
    year + '-' + month + '-' + day + '-' + hours + '-' + min + '-' + sec;
  let strArry = strTime.split('-');
  return new Date(
    Number(strArry[0]),
    Number(strArry[1]) - 1,
    Number(strArry[2]),
    Number(strArry[3]),
    Number(strArry[4]),
    Number(strArry[5]),
  );
}

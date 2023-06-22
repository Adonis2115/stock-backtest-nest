import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs';
import { Stock } from 'src/entities/stocks.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(Stock) private readonly stockRepo: Repository<Stock>,
    private readonly httpService: HttpService,
  ) {}

  async getStock(id: number) {
    return await this.stockRepo.findOne({ where: { id: id } });
  }
  async getAllStock() {
    return await this.stockRepo.find();
  }
  async getStockData(id: number) {
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
      fromDate: '2023-01-01',
      toDate: '2023-06-21',
    };
    const response = this.httpService
      .post('https://api.dhan.co/charts/historical', data, { headers })
      .pipe(map((resp) => resp.data));
    return response;
  }
}

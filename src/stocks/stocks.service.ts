import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from 'src/entities/stocks.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(Stock) private readonly stockRepo: Repository<Stock>,
  ) {}
  async getStock(id: number) {
    return await this.stockRepo.findOne({ where: { id: id } });
  }
  async getAllStock() {
    return await this.stockRepo.find();
  }
}

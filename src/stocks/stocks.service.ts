import { Injectable } from '@nestjs/common';

@Injectable()
export class StocksService {
  getStock(id: string) {
    return { id: id };
  }
}

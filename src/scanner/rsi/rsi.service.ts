import { Injectable } from '@nestjs/common';

@Injectable()
export class RsiService {
  async rsi(date: Date, backtest: boolean) {
    return 'RSI !!';
  }
}

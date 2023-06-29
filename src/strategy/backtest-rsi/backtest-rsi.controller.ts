import { Controller } from '@nestjs/common';
import { BacktestRsiService } from './backtest-rsi.service';

@Controller('backtest-rsi')
export class BacktestRsiController {
  constructor(private readonly backtestRsiService: BacktestRsiService) {}
}

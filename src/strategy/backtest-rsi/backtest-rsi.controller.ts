import { Body, Controller, Post } from '@nestjs/common';
import { BacktestRsiService } from './backtest-rsi.service';
import { PostBacktestRsiDto } from './dto/postBacktestRsiDto';

@Controller('backtest-rsi')
export class BacktestRsiController {
  constructor(private readonly backtestRsiService: BacktestRsiService) {}
  @Post()
  momentum(@Body() postBacktestRsiDto: PostBacktestRsiDto) {
    return this.backtestRsiService.backtestRSI(
      postBacktestRsiDto.startDate,
      postBacktestRsiDto.endDate,
      postBacktestRsiDto.rsi,
      postBacktestRsiDto.balance,
    );
  }
}

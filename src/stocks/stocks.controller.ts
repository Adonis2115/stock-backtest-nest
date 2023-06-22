import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetStockDto } from './dto/getStockDto';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}
  @Get()
  findAll() {
    return this.stocksService.getAllStock();
  }

  @Post()
  getStock(@Body() getStockDto: GetStockDto) {
    return this.stocksService.getStock(getStockDto.stock);
  }

  @Post('/price')
  getStockData(@Body() stock: { id: number }) {
    return this.stocksService.getStockData(stock.id);
  }
}

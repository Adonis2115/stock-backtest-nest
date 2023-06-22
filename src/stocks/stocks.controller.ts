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
  getStockData(
    @Body() stock: { id: number; fromDate: string; toDate: string },
  ) {
    return this.stocksService.getStockData(
      stock.id,
      stock.fromDate,
      stock.toDate,
    );
  }
  @Post('/priceall')
  fetchAllPrices(@Body() stock: { fromDate: string; toDate: string }) {
    return this.stocksService.fetchAllPrices(stock.fromDate, stock.toDate);
  }
}

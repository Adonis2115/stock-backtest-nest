import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetStockDto } from './dto/getStockDto';
import { PostFetchAllPricesDto } from './dto/postFetchAllPricesDto';
import { PostGetStockDataDto } from './dto/postGetStockDataDto';
import { PostStockAndOhlcDto } from './dto/postStockAndOhlcDto';
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
  @Post('/stockohlc')
  getStockOhlc(@Body() postStockAndOhlcDto: PostStockAndOhlcDto) {
    return this.stocksService.getStockAndOhlc(
      postStockAndOhlcDto.id,
      postStockAndOhlcDto.fromDate,
      postStockAndOhlcDto.toDate,
    );
  }
  @Post('/ohlc')
  getOhlc(@Body() postStockAndOhlcDto: PostStockAndOhlcDto) {
    return this.stocksService.getOhlc(
      postStockAndOhlcDto.id,
      postStockAndOhlcDto.fromDate,
      postStockAndOhlcDto.toDate,
    );
  }
  @Post('/price')
  getStockData(@Body() postGetStockDataDto: PostGetStockDataDto) {
    return this.stocksService.getStockData(
      postGetStockDataDto.id,
      postGetStockDataDto.fromDate,
      postGetStockDataDto.toDate,
    );
  }
  @Post('/priceall')
  fetchAllPrices(@Body() postFetchAllPricesDto: PostFetchAllPricesDto) {
    return this.stocksService.fetchAllPrices(
      postFetchAllPricesDto.fromDate,
      postFetchAllPricesDto.toDate,
    );
  }
}

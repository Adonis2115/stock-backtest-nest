import { Body, Controller, Post } from '@nestjs/common';
import { PostTrendto } from './dto/postTrendto';
import { TrendService } from './trend.service';

@Controller('trend')
export class TrendController {
  constructor(private readonly trendService: TrendService) {}
  @Post()
  momentum(@Body() postTrendDto: PostTrendto) {
    return this.trendService.trend(postTrendDto.dateFrom, postTrendDto.dateTo);
  }
}

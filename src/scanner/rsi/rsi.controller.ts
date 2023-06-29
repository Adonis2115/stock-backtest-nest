import { Body, Controller, Post } from '@nestjs/common';
import { PostRsiDto } from './dto/postRsiDto';
import { RsiService } from './rsi.service';

@Controller('rsi')
export class RsiController {
  constructor(private readonly rsiService: RsiService) {}
  @Post()
  rsi(@Body() postRsiDto: PostRsiDto) {
    return this.rsiService.rsi(postRsiDto.date, postRsiDto.rsi);
  }
}

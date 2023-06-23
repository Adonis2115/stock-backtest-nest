import { Body, Controller, Post } from '@nestjs/common';
import { PostMomentumDto } from './dto/postMomentumDto';
import { MomentumService } from './momentum.service';

@Controller('momentum')
export class MomentumController {
  constructor(private readonly momentumService: MomentumService) {}
  @Post()
  momentum(@Body() postMomentumDto: PostMomentumDto) {
    return this.momentumService.momentum(
      postMomentumDto.date,
      postMomentumDto.backtest,
    );
  }
}

import { Controller } from '@nestjs/common';
import { TrendService } from './trend.service';

@Controller('trend')
export class TrendController {
  constructor(private readonly trendService: TrendService) {}
}

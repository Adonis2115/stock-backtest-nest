import { Controller } from '@nestjs/common';
import { MomentumService } from './momentum.service';

@Controller('momentum')
export class MomentumController {
  constructor(private readonly momentumService: MomentumService) {}
}

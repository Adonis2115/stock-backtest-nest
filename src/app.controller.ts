import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

/**
 * ! Alert Comments
 * * Simple Comment
 * ? Query Comment
 * todo ToDo's should go here
 * // Strike through, least important notes(which are done maybe)
 */

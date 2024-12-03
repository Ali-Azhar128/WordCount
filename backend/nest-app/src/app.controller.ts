import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service.js';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(@Res() res: Response) {
    const data = this.appService.getHello();
    res.status(200).send(data);
  }
}

import { Controller, Get, Query, Render, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { TourService } from './tour.service';

@Controller('tour')
export class TourController {
  constructor(
    private readonly tourService: TourService
  ) {}

  @Get('list')
  @Render('tour/list')
  async showListTour(
    @Req() req: Request,
    @Query('searchLocation') searchLocation: string
  ) {
    const data = await this.tourService.showListTour(searchLocation);
    return {data}
  }
}

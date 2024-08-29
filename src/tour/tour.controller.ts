import { Controller, Get, Param, Query, Render, Req } from '@nestjs/common';
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
    @Req() req: Request | any,
    @Query('where') where: string,
    @Query('when') when: string
  ) {
    const data = await this.tourService.showListTour(where, when);
    return {data, userName: req.user.userName}
  }

  @Get('booking/:id')
  @Render('tour/booking')
  async showBookingTour(
    @Req() req: Request | any,
    @Param('id') id: string
  ) {
    const data = await this.tourService.showBookingTour(Number(id));
    return {data, userName: req.user.userName}
  }

  @Get('detail/:id')
  @Render('tour/detail')
  async showDetailTour(
    @Req() req: Request | any,
    @Param('id') id: string
  ) {
    const data = await this.tourService.showDetailTour(Number(id));
    return {...data, userName: req.user.userName}
  }
}

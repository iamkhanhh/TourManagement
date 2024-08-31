import { Body, Controller, Delete, Get, Param, Post, Query, Redirect, Render, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { TourService } from './tour.service';
import { CreateTourDto } from 'src/dto/createTour.dto';

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

  @Delete('delete/:id')
  @Redirect('/provider/manageTour')
  async deleteTour(
    @Param('id') id: string
  ) {

  }

  @Get('edit/:id')
  @Render('tour/editTour')
  async editTour(
    @Param('id') id: string
  ) {
    const data = await this.tourService.editTour(Number(id));
    console.log(data);
    return {...data}
  }

  @Post('edit/:id')
  @Redirect('/provider/manageTour')
  async editTourPost(
    @Param('id') id: string
  ) {

  }

  @Get('create')
  @Render('tour/createTour')
  async createTour() {
    
  }

  @Post('create')
  @Redirect('/provider/manageTour')
  async createTourPost(
    @Req() req: Request | any,
    @Body() createTourDto: CreateTourDto
  ) {
    return await this.tourService.createTour(createTourDto, Number(req.user.userID));
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

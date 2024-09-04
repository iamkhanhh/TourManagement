import { Body, Controller, Delete, Get, Param, Post, Query, Redirect, Render, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { TourService } from './tour.service';
import { CreateTourDto } from 'src/dto/createTour.dto';
import { CreateServiceDto } from 'src/dto/createService.dto';
import { CreateLocationDto } from 'src/dto/createLocation.dto';
import { EditTourDto } from 'src/dto/editTour.dto';
import { BookingDto } from 'src/dto/booking.dto';
import { CommentDto } from 'src/dto/comment.dto';

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
    await this.tourService.deleteTour(Number(id));
  }

  @Get('edit/:id')
  @Render('tour/editTour')
  async editTour(
    @Param('id') id: string,
    @Req() req: Request | any
  ) {
    const data = await this.tourService.editTour(Number(id));
    return {...data, tour_id: Number(id), userName: req.user.username}
  }

  @Post('edit/:id')
  @Redirect('/provider/manageTour')
  async editTourPost(
    @Param('id') id: string,
    @Body() editTourDto: EditTourDto
  ) {
    await this.tourService.editTourPost(editTourDto, Number(id));
  }

  @Get('create')
  @Render('tour/createTour')
  async createTour(@Req() req: Request | any) {
    return {userName: req.user.userName}
  }

  @Post('create')
  @Redirect('/provider/manageTour')
  async createTourPost(
    @Req() req: Request | any,
    @Body() createTourDto: CreateTourDto
  ) {
    return await this.tourService.createTour(createTourDto, Number(req.user.userID));
  }

  // manage services
  @Get('editService/:id')
  @Render('tour/editService')
  async editService(
    @Param('id') id: string,
    @Req() req: Request | any
  ) {
    const data = await this.tourService.editService(Number(id));
    return {...data, userName: req.user.userName}
  }

  @Post('editService/:id')
  @Redirect('/provider/servicesManagement')
  async editServicePost(
    @Param('id') id: string,
    @Body() createServiceDto: CreateServiceDto
  ) {
    await this.tourService.editServicePost(createServiceDto, Number(id));
  }

  @Delete('deleteService/:id')
  @Redirect('/provider/servicesManagement')
  async deleteService(
    @Param('id') id: string
  ) {
    await this.tourService.deleteService(Number(id));
  }

  @Get('createService/:idTour')
  @Render('tour/createService')
  async createService(
    @Param('idTour') idTour: string,
    @Req() req: Request | any
  ) {
    return {idTour, userName: req.user.userName}
  }

  @Post('createService/:idTour')
  @Redirect('/provider/servicesManagement')
  async createServicePost(
    @Req() req: Request | any,
    @Body() createServiceDto: CreateServiceDto,
    @Param('idTour') idTour: string
  ) {
    return await this.tourService.createServicePost(createServiceDto, Number(idTour));
  }

  @Get('booking/:id')
  @Render('tour/booking')
  async showBookingTour(
    @Req() req: Request | any,
    @Param('id') id: string
  ) {
    const data = await this.tourService.showBookingTour(Number(id));
    return {...data, userName: req.user.userName}
  }

  @Post('booking/:idTour')
  @Redirect()
  async bookingPost(
    @Req() req: Request | any,
    @Body() bookingDto: BookingDto,
    @Param('idTour') idTour: string
  ) {
    await this.tourService.bookingPost(bookingDto, Number(idTour), req.user.userID);
    return {url: '/tour/detail/' + idTour}
  }

  @Post('comment/:idTour')
  @Redirect()
  async commentPost(
    @Req() req: Request | any,
    @Body() commentDto: CommentDto,
    @Param('idTour') idTour: string
  ) {
    await this.tourService.commentPost(commentDto, Number(idTour), req.user.userID);
    return {url: '/tour/detail/' + idTour}
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

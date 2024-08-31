import { Body, Controller, Delete, Get, Param, Post, Query, Redirect, Render, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { TourService } from './tour.service';
import { CreateTourDto } from 'src/dto/createTour.dto';
import { CreateServiceDto } from 'src/dto/createService.dto';
import { CreateLocationDto } from 'src/dto/createLocation.dto';

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

  // manage services
  @Get('editService/:id')
  @Render('tour/editService')
  async editService(
    @Param('id') id: string
  ) {
    const data = await this.tourService.editService(Number(id));
    console.log(data);
    return {...data}
  }

  @Post('editService/:id')
  @Redirect('/provider/servicesManagement')
  async editServicePost(
    @Param('id') id: string,
    @Body() createServiceDto: CreateServiceDto
  ) {
    await this.tourService.editServicePost(createServiceDto, Number(id));
  }

  @Get('createService/:idTour')
  @Render('tour/createTour')
  async createService(@Param('idTour') idTour: string) {
    return {idTour}
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

  // manage locations
  @Get('editLocation/:id')
  @Render('tour/editLocation')
  async editLocation(
    @Param('id') id: string
  ) {
    const data = await this.tourService.editLocation(Number(id));
    console.log(data);
    return {...data}
  }

  @Post('editLocation/:id')
  @Redirect('/provider/locationsManagement')
  async editLocationPost(
    @Param('id') id: string,
    @Body() createLocationDto: CreateLocationDto,
  ) {
    await this.tourService.editLocationPost(createLocationDto, Number(id));
  }

  // @Get('createLocation/:idTour')
  // @Render('tour/createLocation')
  // async createLocation(@Param('idTour') idTour: string) {
  //   return {idTour}
  // }

  // @Post('createLocation/:idTour')
  // @Redirect('/provider/locationsManagement')
  // async createLocationPost(
  //   @Req() req: Request | any,
  //   @Body() createLocationDto: CreateLocationDto,
  //   @Param('idTour') idTour: string
  // ) {
  //   return await this.tourService.createLocationPost(createLocationDto, Number(idTour));
  // }

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

import { Controller, Get, Param, Query, Render, Req } from '@nestjs/common';
import { ProviderService } from './provider.service';

@Controller('provider')
export class ProviderController {
  constructor(
    private readonly providerService: ProviderService
  ) {}

  @Get('manageTour')
  @Render('provider/manageTour')
  async manageTour(
    @Req() req: Request | any,
  ) {
    const data = await this.providerService.manageTour(req.user.userID);
    return {data, userName: req.user.userName}
  }

  @Get('locationsManagement')
  @Render('provider/locationsManagement')
  async locationsManagement(
    @Req() req: Request | any,
  ) {
    const data = await this.providerService.locationsManagement(req.user.userID);
    return {data, userName: req.user.userName}
  }

  @Get('servicesManagement')
  @Render('provider/servicesManagement')
  async servicesManagement(
    @Req() req: Request | any,
  ) {
    const data = await this.providerService.servicesManagement(req.user.userID);
    return {data, userName: req.user.userName}
  }

  @Get('list')
  @Render('provider/list')
  async showListProvider(
    @Req() req: Request | any,
    @Query('searchProvider') searchProvider: string
  ) {
    const data = await this.providerService.showListProvider(searchProvider);
    return {data, userName: req.user.userName}
  }

  @Get('detail/:id')
  @Render('provider/detail')
  async showDetailProvider(
    @Req() req: Request | any,
    @Param('id') id: string
  ) {
    const data = await this.providerService.showDetailProvider(Number(id));
    return {...data, userName: req.user.userName}
  }
}

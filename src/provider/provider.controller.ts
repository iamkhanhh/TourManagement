import { Controller, Get, Param, Query, Render, Req } from '@nestjs/common';
import { ProviderService } from './provider.service';

@Controller('provider')
export class ProviderController {
  constructor(
    private readonly providerService: ProviderService
  ) {}

  @Get('list')
  @Render('provider/list')
  async showListProvider(
    @Query('searchProvider') searchProvider: string
  ) {
    const data = await this.providerService.showListProvider(searchProvider);
    return {data}
  }

  @Get('detail/:id')
  @Render('provider/detail')
  async showDetailProvider(
    @Param('id') id: string
  ) {
    const data = await this.providerService.showDetailProvider(Number(id));
    return {data}
  }
}

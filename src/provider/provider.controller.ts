import { Controller, Get, Query, Render, Req } from '@nestjs/common';
import { ProviderService } from './provider.service';

@Controller('provider')
export class ProviderController {
  constructor(
    private readonly providerService: ProviderService
  ) {}

  @Get('list')
  @Render('provider/list')
  async showListProvider(
    @Req() req: Request,
    @Query('searchProvider') searchProvider: string
  ) {
    const data = await this.providerService.showListProvider(searchProvider);
    return {data}
  }
}

import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guard/admin.guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor() {}

  @Get()
  @Render('admin/dashboard')
  showAdminDashboard() {
    
  }
}

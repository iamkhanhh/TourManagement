import { Controller, Delete, Get, Param, Post, Query, Redirect, Render, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guard/admin.guard';
import { AdminService } from './admin.service';
import { url } from 'inspector';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('edit-user/:id')
  @Render('admin/dashboard')
  async editUser(
    @Param('id') id: string,
  ) {
    const data = await this.adminService.editUser(Number(id));
    console.log(data);
    return {data}
  }

  @Post('edit-user/:id')
  @Redirect()
  async editUserPost(
    @Param('id') id: string,
  ) {
    const data = await this.adminService.editUserPost(Number(id));
    return {url: 'edit-user/' + id as string}
  }

  @Delete('delete-user/:id')
  @Redirect('/admin?mode=all')
  async deleteUser(
    @Param('id') id: string,
  ) {
    await this.adminService.deleteUser(Number(id));
  }

  @Get()
  @Render('admin/dashboard')
  async showAdminDashboard(
    @Query('mode') mode: string,
  ) {
    const data = await this.adminService.dashboard(mode);
    return {data}
  }
}

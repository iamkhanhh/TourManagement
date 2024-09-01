import { Body, Controller, Delete, Get, Param, Post, Query, Redirect, Render, Req, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guard/admin.guard';
import { AdminService } from './admin.service';
import { EditUserDto } from 'src/dto/editUser.dto';
import { Response, Request } from 'express';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('edit-user/:id')
  @Render('admin/editUser')
  async editUser(
    @Param('id') id: string,
    @Req() req: Request | any,
  ) {
    const data = await this.adminService.editUser(Number(id));
    return {...data, userName: req.user.userName}
  }

  @Post('edit-user/:id')
  @Redirect()
  async editUserPost(
    @Param('id') id: string,
    @Body() editUserDto: EditUserDto
  ) {
    const data = await this.adminService.editUserPost(editUserDto, Number(id));
    return {url: '/admin/edit-user/' + id}
  }

  @Post('add-admin/:id')
  @Redirect()
  async grantAdmin(
    @Param('id') id: string,
  ) {
    const data = await this.adminService.grantAdmin(Number(id));
    return {url: '/admin/edit-user/' + id}
  }

  @Post('resetPassword-user/:id')
  @Redirect('/admin?mode=all')
  async resetPassword(
    @Param('id') id: string,
  ) {
    return await this.adminService.resetPassword(Number(id));
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
    @Req() req: Request | any,
  ) {
    const data = await this.adminService.dashboard(mode);
    return {data, userName: req.user.userName}
  }
}

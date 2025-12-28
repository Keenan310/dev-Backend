import { Controller, Get, Post, Body, Patch, Param, Req, Headers, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminModel, AdminModelUpdate } from './admin.model';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';


@ApiTags("Admin Modules")
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Headers() header: Headers,
     @Body() createAdminDto: AdminModel) {
    return this.adminService.create(header, createAdminDto);
  }

  @Get()
  findAll(@Headers() header: Headers) {
    return this.adminService.findAll(header);
  }

  @Get('all')
  findAllAdmin(@Headers() header: Headers) {
    return this.adminService.findAllAdmin(header);
  }

  @Get(':uid')
  findOne(@Headers() header: Headers, @Param('uid') uid: string) {
    return this.adminService.findOne(header, uid);
  }

  @Patch(':uid')
  update(
    @Headers() header: Headers,
    @Param('uid') uid: string,
    @Body() updateAdminDto: AdminModelUpdate) {
    return this.adminService.update(header, uid, updateAdminDto);
  }

  @Delete(':uid')
  delete(@Headers() header: Headers,
   @Param('uid') uid: string) {
    return this.adminService.delete(header, uid);
  }

}

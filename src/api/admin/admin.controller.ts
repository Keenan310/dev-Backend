import { Controller, Get, Post, Body, Patch, Param, Req, Headers } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminModel, AdminModelUpdate } from './admin.model';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';

@ApiExcludeController()
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

}

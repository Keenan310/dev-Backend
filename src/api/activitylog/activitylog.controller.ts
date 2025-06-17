import { Controller, Get, Post, Headers, Patch, Param, Delete } from '@nestjs/common';
import { ActivitylogService } from './activitylog.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Activity Log')
@Controller()
export class ActivitylogController {
  constructor(private readonly activitylogService: ActivitylogService) {}

  @Get('admin/activitylog')
  findAllAgent(
    @Headers() header: Headers) {
    return this.activitylogService.findByAgent(header);
  }

  @Get('agent/activitylog')
  findAllAdmin(
    @Headers() header: string) {
    return this.activitylogService.findByAdmin(header);
  }
}



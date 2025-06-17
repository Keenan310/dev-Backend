import { Controller, Get, Patch, Param, Headers } from '@nestjs/common';
import { ControlService } from './control.service';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';

@ApiExcludeController()
@ApiTags('Admin Control')
@Controller('admin/control')
export class ControlController {
  constructor(private readonly controlService: ControlService) {}

  @Get()
  findOne(
    @Headers() header: Headers,
  ) {
    return this.controlService.findOne(header);
  }

  @Patch()
  update(
    @Headers() header: Headers,
    @Param('status') status: string) {
    return this.controlService.update(header, status);
  }
}

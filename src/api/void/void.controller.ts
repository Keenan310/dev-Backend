import { Post, Body, Param, Headers, Controller } from '@nestjs/common';
import { VoidService } from './void.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VoidDesicion, VoidModel } from './void.model';


@ApiTags("Void Modules")
@Controller('')
export class VoidController {
  constructor(private readonly voidService: VoidService) {}

  @ApiBearerAuth('access_token')
  @Post('agent/void/request/:bookingUId')
  createVoidRequest(
    @Headers() header: string,
    @Param('bookingUId') bookingUId:string,
    @Body() createVoidDto: VoidModel) {
    return this.voidService.createVoidRequest(header, bookingUId, createVoidDto);
  }

  @Post('admin/void/request/:bookingUId/:status/:servicefee')
  voidDecision(
    @Headers() header: Headers,
    @Param('bookingUId') bookingUId:string,
    @Param('status') status:string,
    @Param('servicefee') servicefee:number,
    @Body() voidDesicionDto: VoidDesicion) {
    return this.voidService.voidDecision(header, bookingUId, status, servicefee, voidDesicionDto);
  }
}
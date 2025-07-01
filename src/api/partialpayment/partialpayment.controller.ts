import { Controller, Get, Headers, Param, NotAcceptableException, Query, Patch, Body } from '@nestjs/common';
import { PartialpaymentService } from './partialpayment.service';
import { ApiBearerAuth, ApiExcludeController, ApiHeader, ApiHeaders, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UpdatePartialpaymentDto } from './dto/update-partialpayment.dto';

@ApiExcludeController()
@ApiTags('Partial Payment')
@Controller()
export class PartialpaymentController {
  constructor(private readonly partialpaymentService: PartialpaymentService) {}


  @ApiBearerAuth('access_token')
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'filter', required: false })
  @Get('admin/partial/payment')
  findAllAdmin(
    @Headers() header?: string,
    @Query('page') page?: number,
    @Query('status') status?: string,
    @Query('filter') filter?: string,
    @Query('limit') limit?: number,
  ) {
    if(limit > 100 || limit < 10){
      throw new NotAcceptableException("Maximum Limit must be 10-100");
    }{
      return this.partialpaymentService.findAllAdmin(header, page, status, filter, limit);
    }
  }

  @ApiBearerAuth('access_token')
  @Patch('admin/partial/payment/:uid')
  updateOneAdmin(
    @Headers() header: Headers,
    @Param('uid') uid: string,
    @Body() updatePartialpaymentDto: UpdatePartialpaymentDto){
      return this.partialpaymentService.updateOneAdmin(header, uid, updatePartialpaymentDto);
  }

  @ApiBearerAuth('access_token')
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'filter', required: false })
  @Get('agent/partial/payment')
  findAllAgent(
    @Headers() header?: string,
    @Query('page') page?: number,
    @Query('status') status?: string,
    @Query('filter') filter?: string,
    @Query('limit') limit?: number,
  ) {
    if(limit > 100 || limit < 10){
      throw new NotAcceptableException("Maximum Limit must be 10-100");
    }{
      return this.partialpaymentService.findAllAgent(header, page, status, filter, limit);
    }
  }

  @ApiBearerAuth('access_token')
  @Get('agent/partial/payment/pay/due/:uid')
  payduePartialPayment(
    @Headers() header: string,
    @Param('uid') uid: string) {

      return this.partialpaymentService.paydue(header, uid);
    }

}

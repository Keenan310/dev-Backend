import { Controller, Get, Headers, Param, Delete } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags("Promotion")
@Controller()
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @ApiBearerAuth('access_token')
  @Get('agent/promotion/offers')
  findAllAgent(@Headers() header: string) {
    return this.promotionService.findAllAgent(header);
  }

  @ApiBearerAuth('access_token')
  @Get('admin/promotion/offers')
  findAllAdmin(@Headers() header: Headers) {
    return this.promotionService.findAllAdmin(header);
  }

  @ApiBearerAuth('access_token')
  @Delete('admin/promotion/:id')
  remove(
    @Headers() header: Headers,
    @Param('id') id: string) {
    return this.promotionService.remove(header, +id);
  }
}

import { Module } from '@nestjs/common';
import { PaymentgatewayService } from './paymentgateway.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PaymentgatewayService],
})
export class PaymentgatewayModule {}

import { Module } from '@nestjs/common';
import { PaymentgatewayService } from './paymentgateway.service';
import { NagadModule } from './nagad/nagad.module';
import { BkashModule } from './bkash/bkash.module';

@Module({
  imports: [ NagadModule, BkashModule],
  controllers: [],
  providers: [PaymentgatewayService],
})
export class PaymentgatewayModule {}

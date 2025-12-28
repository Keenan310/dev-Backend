import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { PaymentgatewayModule } from './paymentgateway/paymentgateway.module';

@Module(
  {
    imports: [
    ConfigModule.forRoot(
      {
        envFilePath: '.env'
      }
    ),
    DatabaseModule, ApiModule, MailModule, PaymentgatewayModule],
    controllers: [AppController],
    providers: [
      AppService],
  }
)
export class AppModule {}

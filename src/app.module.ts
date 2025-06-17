import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ApiModule } from './api/api.module';
import { UtilsModule } from './utils/utils.module';
import { ConfigModule } from '@nestjs/config';
import { GatewayModule } from './gateway/gateway.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MailModule } from './mail/mail.module';
import { PaymentgatewayModule } from './paymentgateway/paymentgateway.module';

@Module(
  {
    imports: [CacheModule.register(),
      // ThrottlerModule.forRoot([
      //   {
      //     ttl: 10000000,
      //     limit: 100,
      //   }
      // ]),
    ConfigModule.forRoot(
      {
        envFilePath: '.env'
      }
    ),
    DatabaseModule, ApiModule, UtilsModule, GatewayModule, MailModule, PaymentgatewayModule],
    controllers: [AppController],
    providers: [
      // {
      //   provide: APP_GUARD,
      //   useClass:ThrottlerGuard
      // },
      AppService],
  }
)
export class AppModule {}

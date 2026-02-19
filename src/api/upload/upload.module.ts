
import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { DoSpacesServicerovider } from './upload.provider.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentModel } from '../agent/agent.model';
import { AdminModel } from '../admin/admin.model';
import { StaffModel } from '../staff/staff.model';
import { BookingModel } from '../booking/booking.model';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ReissueModel } from '../reissue/reissue.model';
import { PromotionModel } from '../promotion/promotion.model';
import { DepositModel } from '../deposit/deposit.model';
import { PassengerModel } from '../passenger/passenger.model';
import { MailService } from 'src/mail/mail.service';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AgentModel,
      PassengerModel,
      DepositModel,
      AdminModel,
      StaffModel,
      AgentModel,
      BookingModel,
      ReissueModel,
      PromotionModel,
      OTPModel,
    ]),
  ],
  controllers: [UploadController],
  providers: [UploadService, DoSpacesServicerovider, AuthService, JwtService, AuthUtils, MailService],
})
export class UploadModule {}
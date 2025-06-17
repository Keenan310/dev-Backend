import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionModel } from './promotion.model';
import { AuthService } from '../auth/auth.service';
import { AgentModel } from '../agent/agent.model';
import { StaffModel } from '../staff/staff.model';
import { AdminModel } from '../admin/admin.model';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { BookingModel } from '../booking/booking.model';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';

@Module({
  imports: [TypeOrmModule.forFeature([PromotionModel, AgentModel, StaffModel, AdminModel, BookingModel, OTPModel])],
  controllers: [PromotionController],
  providers: [PromotionService, AuthService, JwtService, AuthUtils, MailService],
})
export class PromotionModule {}

import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeModel } from './notice.model';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { AgentModel } from '../agent/agent.model';
import { StaffModel } from '../staff/staff.model';
import { AdminModel } from '../admin/admin.model';
import { MailService } from 'src/mail/mail.service';
import { BookingModel } from '../booking/booking.model';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';

@Module({
  imports: [TypeOrmModule.forFeature([NoticeModel, AgentModel, StaffModel, AdminModel, BookingModel, OTPModel])],
  controllers: [NoticeController],
  providers: [NoticeService, JwtService, AuthService, AuthUtils, MailService],
})
export class NoticeModule {}

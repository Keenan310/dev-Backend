import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentModel } from 'src/api/agent/agent.model';
import { BookingModel } from 'src/api/booking/booking.model';
import { AuthService } from 'src/api/auth/auth.service';
import { StaffModel } from 'src/api/staff/staff.model';
import { AdminModel } from 'src/api/admin/admin.model';
import { JwtService } from '@nestjs/jwt';
import { AuthUtils } from 'src/api/auth/auth.utils';
import { OTPModel } from 'src/api/auth/auth.model';

@Module({
  imports: [TypeOrmModule.forFeature([AgentModel, BookingModel, StaffModel, AdminModel, OTPModel])],
  providers: [MailService,AuthService ,AuthUtils, JwtService],
})
export class MailModule {}

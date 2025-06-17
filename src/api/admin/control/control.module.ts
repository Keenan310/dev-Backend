import { Module } from '@nestjs/common';
import { ControlService } from './control.service';
import { ControlController } from './control.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControlModel } from './entities/control.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/api/auth/auth.service';
import { AgentModel } from 'src/api/agent/agent.model';
import { StaffModel } from 'src/api/staff/staff.model';
import { AdminModel } from '../admin.model';
import { MailService } from 'src/mail/mail.service';
import { BookingModel } from 'src/api/booking/booking.model';
import { AuthUtils } from 'src/api/auth/auth.utils';
import { OTPModel } from 'src/api/auth/auth.model';

@Module({
  imports: [TypeOrmModule.forFeature([ControlModel, AgentModel, StaffModel, AdminModel, MailService,BookingModel, OTPModel ])],
  controllers: [ControlController],
  providers: [ControlService, JwtService, AuthService, AuthUtils, MailService],
})
export class ControlModule {}

import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModel } from '../admin.model';
import { MailService } from 'src/mail/mail.service';
import { BookingModel } from 'src/api/booking/booking.model';
import { ControlModel } from '../control/entities/control.entity';
import { AgentModel } from 'src/api/agent/agent.model';
import { StaffModel } from 'src/api/staff/staff.model';

@Module({
  imports: [TypeOrmModule.forFeature([ControlModel, AgentModel, StaffModel, AdminModel, MailService,BookingModel ])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}

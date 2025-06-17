import { Module } from '@nestjs/common';
import { NagadService } from './nagad.service';
import { NagadController } from './nagad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentModel } from 'src/api/agent/agent.model';
import { DepositModel } from 'src/api/deposit/deposit.model';
import { AgentLedgerModel } from 'src/api/report/report.model';
import { MailService } from 'src/mail/mail.service';
import { BookingModel } from 'src/api/booking/booking.model';

@Module({
  imports: [TypeOrmModule.forFeature([AgentModel, DepositModel, AgentLedgerModel, BookingModel])],
  controllers: [NagadController],
  providers: [NagadService, MailService],
})
export class NagadModule {}

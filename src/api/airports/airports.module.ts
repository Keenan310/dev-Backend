import { Module } from '@nestjs/common';
import { AirportsService } from './airports.service';
import { AirportsController } from './airports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportsModel } from './airports.model';
import { MailService } from 'src/mail/mail.service';
import { BookingModel } from '../booking/booking.model';
import { AgentModel } from '../agent/agent.model';

@Module({
  imports: [TypeOrmModule.forFeature([AirportsModel, AgentModel, BookingModel])],
  controllers: [AirportsController],
  providers: [AirportsService, MailService],
})
export class AirportsModule {}

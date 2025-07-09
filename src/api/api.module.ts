import { Module } from '@nestjs/common';
import { AgentModule } from './agent/agent.module';
import { AuthModule } from './auth/auth.module';
import { NoticeModule } from './notice/notice.module';
import { SearchhistoryModule } from './searchhistory/searchhistory.module';
import { PromotionModule } from './promotion/promotion.module';
import { PassengerModule } from './passenger/passenger.module';
import { BookingModule } from './booking/booking.module';
import { DepositModule } from './deposit/deposit.module';
import { ReportModule } from './report/report.module';
import { FlightModule } from './flight/flight.module';
import { AirlinesModule } from './airlines/airlines.module';
import { AirportsModule } from './airports/airports.module';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
import { StaffModule } from './staff/staff.module';
import { BanklistModule } from './banklist/banklist.module';
import { RefundModule } from './refund/refund.module';
import { ReissueModule } from './reissue/reissue.module';
import { GroupfareModule } from './groupfare/groupfare.module';
import { NotesModule } from './notes/notes.module';
import { VoidModule } from './void/void.module';
import { TicketingModule } from './ticketing/ticketing.module';
import { TravellerModule } from './traveller/traveller.module';
import { ActivitylogModule } from './activitylog/activitylog.module';
import { MarkupModule } from './admin/markup/markup.module';
import { ControlModule } from './admin/control/control.module';
import { CurrencyModule } from './currency/currency.module';
@Module({
  imports: [AuthModule, AgentModule, AdminModule, FlightModule, BookingModule,TicketingModule,VoidModule,
    RefundModule, ReissueModule, TravellerModule, NoticeModule, PromotionModule, AirlinesModule,
    PassengerModule, DepositModule, ReportModule, UploadModule, StaffModule, GroupfareModule,
     NotesModule, BanklistModule, AirportsModule, SearchhistoryModule, MarkupModule,
    ControlModule, ActivitylogModule, CurrencyModule]
})
export class ApiModule {}

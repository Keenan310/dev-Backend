"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiModule = void 0;
const common_1 = require("@nestjs/common");
const agent_module_1 = require("./agent/agent.module");
const auth_module_1 = require("./auth/auth.module");
const notice_module_1 = require("./notice/notice.module");
const searchhistory_module_1 = require("./searchhistory/searchhistory.module");
const promotion_module_1 = require("./promotion/promotion.module");
const passenger_module_1 = require("./passenger/passenger.module");
const booking_module_1 = require("./booking/booking.module");
const deposit_module_1 = require("./deposit/deposit.module");
const report_module_1 = require("./report/report.module");
const flight_module_1 = require("./flight/flight.module");
const airlines_module_1 = require("./airlines/airlines.module");
const airports_module_1 = require("./airports/airports.module");
const upload_module_1 = require("./upload/upload.module");
const admin_module_1 = require("./admin/admin.module");
const staff_module_1 = require("./staff/staff.module");
const banklist_module_1 = require("./banklist/banklist.module");
const refund_module_1 = require("./refund/refund.module");
const reissue_module_1 = require("./reissue/reissue.module");
const groupfare_module_1 = require("./groupfare/groupfare.module");
const notes_module_1 = require("./notes/notes.module");
const void_module_1 = require("./void/void.module");
const ticketing_module_1 = require("./ticketing/ticketing.module");
const traveller_module_1 = require("./traveller/traveller.module");
const markup_module_1 = require("./admin/markup/markup.module");
const control_module_1 = require("./admin/control/control.module");
const currency_module_1 = require("./currency/currency.module");
let ApiModule = class ApiModule {
};
exports.ApiModule = ApiModule;
exports.ApiModule = ApiModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, agent_module_1.AgentModule, admin_module_1.AdminModule, flight_module_1.FlightModule, booking_module_1.BookingModule, ticketing_module_1.TicketingModule, void_module_1.VoidModule,
            refund_module_1.RefundModule, reissue_module_1.ReissueModule, traveller_module_1.TravellerModule, notice_module_1.NoticeModule, promotion_module_1.PromotionModule, airlines_module_1.AirlinesModule,
            passenger_module_1.PassengerModule, deposit_module_1.DepositModule, report_module_1.ReportModule, upload_module_1.UploadModule, staff_module_1.StaffModule, groupfare_module_1.GroupfareModule,
            notes_module_1.NotesModule, banklist_module_1.BanklistModule, airports_module_1.AirportsModule, searchhistory_module_1.SearchhistoryModule, markup_module_1.MarkupModule,
            control_module_1.ControlModule, currency_module_1.CurrencyModule]
    })
], ApiModule);
//# sourceMappingURL=api.module.js.map
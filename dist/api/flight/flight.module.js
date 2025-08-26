"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightModule = void 0;
const common_1 = require("@nestjs/common");
const flight_service_1 = require("./flight.service");
const sabre_flights_service_1 = require("./sabre.flights.service");
const typeorm_1 = require("@nestjs/typeorm");
const airlines_model_1 = require("../airlines/airlines.model");
const airports_model_1 = require("../airports/airports.model");
const booking_service_1 = require("../booking/booking.service");
const passenger_service_1 = require("../passenger/passenger.service");
const booking_model_1 = require("../booking/booking.model");
const passenger_model_1 = require("../passenger/passenger.model");
const airlines_service_1 = require("../airlines/airlines.service");
const airports_service_1 = require("../airports/airports.service");
const agent_model_1 = require("../agent/agent.model");
const auth_service_1 = require("../auth/auth.service");
const staff_model_1 = require("../staff/staff.model");
const admin_model_1 = require("../admin/admin.model");
const jwt_1 = require("@nestjs/jwt");
const refund_model_1 = require("../refund/refund.model");
const reissue_model_1 = require("../reissue/reissue.model");
const report_model_1 = require("../report/report.model");
const ticketing_model_1 = require("../ticketing/ticketing.model");
const mail_service_1 = require("../../mail/mail.service");
const groupfare_service_1 = require("../groupfare/groupfare.service");
const groupfare_model_1 = require("../groupfare/groupfare.model");
const traveller_service_1 = require("../traveller/traveller.service");
const traveller_model_1 = require("../traveller/traveller.model");
const searchhistory_model_1 = require("../searchhistory/searchhistory.model");
const sabre_flight_utils_1 = require("./sabre.flight.utils");
const searchhistory_service_1 = require("../searchhistory/searchhistory.service");
const booking_utils_1 = require("../booking/booking.utils");
const auth_utils_1 = require("../auth/auth.utils");
const auth_model_1 = require("../auth/auth.model");
const pre_flight_controller_1 = require("./pre-flight.controller");
const post_flight_controller_1 = require("./post-flight.controller");
const activitylog_service_1 = require("../activitylog/activitylog.service");
const activitylog_entity_1 = require("../activitylog/entities/activitylog.entity");
const alhind_flights_service_1 = require("./alhind.flights.service");
const currency_entity_1 = require("../currency/entities/currency.entity");
const core_1 = require("@nestjs/core");
const cache_manager_1 = require("@nestjs/cache-manager");
let FlightModule = class FlightModule {
};
exports.FlightModule = FlightModule;
exports.FlightModule = FlightModule = __decorate([
    (0, common_1.Module)({
        imports: [cache_manager_1.CacheModule.register({
                ttl: 5,
                max: 100,
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([airlines_model_1.AirlinesModel, searchhistory_model_1.SearchHistoryModel, groupfare_model_1.GroupFareModel, traveller_model_1.TravellerModel, ticketing_model_1.TicketModel, airports_model_1.AirportsModel,
                booking_model_1.BookingModel, passenger_model_1.PassengerModel, agent_model_1.AgentModel, staff_model_1.StaffModel, admin_model_1.AdminModel, refund_model_1.RefundModel, reissue_model_1.ReissueModel,
                report_model_1.AgentLedgerModel, auth_model_1.OTPModel, activitylog_entity_1.ActivityLogModel, currency_entity_1.CurrencyConverter])],
        controllers: [pre_flight_controller_1.PreFlightController, post_flight_controller_1.PostFlightController],
        providers: [{
                provide: core_1.APP_INTERCEPTOR,
                useClass: cache_manager_1.CacheInterceptor,
            },
            flight_service_1.FlightService, traveller_service_1.TravellerService, groupfare_service_1.GroupfareService, sabre_flights_service_1.SabreService, airlines_service_1.AirlinesService, booking_utils_1.BookingUtils,
            mail_service_1.MailService, airports_service_1.AirportsService, booking_service_1.BookingService, passenger_service_1.PassengerService, auth_service_1.AuthService, jwt_1.JwtService, sabre_flight_utils_1.SabreUtils,
            searchhistory_service_1.SearchhistoryService, auth_utils_1.AuthUtils, activitylog_service_1.ActivitylogService, alhind_flights_service_1.AlhindAPI]
    })
], FlightModule);
//# sourceMappingURL=flight.module.js.map
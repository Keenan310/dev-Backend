"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostFlightController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const seatmap_flight_dto_1 = require("./dto/seatmap-flight.dto");
const flight_service_1 = require("./flight.service");
const farerules_flight_dto_1 = require("./dto/farerules-flight.dto");
let PostFlightController = class PostFlightController {
    constructor(flightService) {
        this.flightService = flightService;
    }
    AirFareRulesAgent(header, farerulesDto) {
        return this.flightService.airfarerulesagent(header, farerulesDto);
    }
    AirFareRulesAdmin(header, farerulesDto) {
        return this.flightService.airfarerulesadmin(header, farerulesDto);
    }
    AirSeatMapAgent(header, seatMapDto) {
        return this.flightService.airseatmapagent(header, seatMapDto);
    }
    AirSeatMapAdmin(header, seatMapDto) {
        return this.flightService.airseatmapadmin(header, seatMapDto);
    }
    AirRetrieveAgent(header, bookingUId) {
        return this.flightService.airretrieveagent(header, bookingUId);
    }
    AirRetrieveAdmin(header, bookingUId) {
        return this.flightService.airretrieveadmin(header, bookingUId);
    }
    AirCheckPNR(header, system, pnr) {
        return this.flightService.aircheckpnr(header, system, pnr);
    }
    AirCancelAgent(header, bookingUId) {
        return this.flightService.aircancelagent(header, bookingUId);
    }
    AirCancelAdmin(header, bookingUId) {
        return this.flightService.aircanceladmin(header, bookingUId);
    }
    AirImportPnr(header, system, pnr) {
        return this.flightService.airimportpnr(header, system, pnr);
    }
};
exports.PostFlightController = PostFlightController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)("agent/flight/fare/rules"),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, farerules_flight_dto_1.FareRulesDto]),
    __metadata("design:returntype", void 0)
], PostFlightController.prototype, "AirFareRulesAgent", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)("admin/flight/fare/rules"),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, farerules_flight_dto_1.FareRulesDto]),
    __metadata("design:returntype", void 0)
], PostFlightController.prototype, "AirFareRulesAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)("agent/flight/seatmap"),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, seatmap_flight_dto_1.SeapMapDto]),
    __metadata("design:returntype", void 0)
], PostFlightController.prototype, "AirSeatMapAgent", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)("admin/flight/seatmap"),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, seatmap_flight_dto_1.SeapMapDto]),
    __metadata("design:returntype", void 0)
], PostFlightController.prototype, "AirSeatMapAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)("agent/flight/booking/details/:bookingUId"),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PostFlightController.prototype, "AirRetrieveAgent", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)("admin/flight/booking/details/:bookingUId"),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PostFlightController.prototype, "AirRetrieveAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)("agent/flight/booking/check/:system/:pnr"),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('system')),
    __param(2, (0, common_1.Param)('pnr')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PostFlightController.prototype, "AirCheckPNR", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)("agent/flight/booking/cancel/:bookingUId"),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PostFlightController.prototype, "AirCancelAgent", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)("admin/flight/booking/cancel/:bookingUId"),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PostFlightController.prototype, "AirCancelAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)("agent/flight/booking/import/:system/:pnr"),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('system')),
    __param(2, (0, common_1.Param)('pnr')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PostFlightController.prototype, "AirImportPnr", null);
exports.PostFlightController = PostFlightController = __decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiTags)('Post Ticketing Modules'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [flight_service_1.FlightService])
], PostFlightController);
//# sourceMappingURL=post-flight.controller.js.map
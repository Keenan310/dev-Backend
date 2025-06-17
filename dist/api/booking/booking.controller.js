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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const booking_model_1 = require("./booking.model");
const swagger_1 = require("@nestjs/swagger");
let BookingController = class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    findAllAdmin(header, page, status, filter, limit) {
        if (limit > 100 || limit < 10) {
            throw new common_1.NotAcceptableException("Maximum Limit must be 10-100");
        }
        return this.bookingService.findAllAdmin(header, page, status, filter, limit);
    }
    findOneAgentByAdmin(header, agentUId, page, status, filter, limit) {
        if (limit > 100 || limit < 10) {
            throw new common_1.NotAcceptableException("Maximum Limit must be 10-100");
        }
        return this.bookingService.findAllAgentByAdmin(header, agentUId, page, status, filter, limit);
    }
    findAllAgent(header, page, status, filter, limit) {
        if (limit > 100 || limit < 10) {
            throw new common_1.NotAcceptableException("Maximum Limit must be 10-100");
        }
        return this.bookingService.findAllAgent(header, page, status, filter, limit);
    }
    findOneAgent(header, bookingUId) {
        return this.bookingService.findOneAgent(header, bookingUId);
    }
    findOneBookingAdmin(header, bookingUId) {
        return this.bookingService.findOneByAdmin(header, bookingUId);
    }
    findPastFlightAgentId(header) {
        return this.bookingService.findPastFlightAgentId(header);
    }
    findUpcomingFlightAgentId(header) {
        return this.bookingService.findUpcomingFlightAgentId(header);
    }
    findCalendareByAgentId(header, yearMonth) {
        return this.bookingService.findCalendareAgentId(header, yearMonth);
    }
    update(header, bookingUId, updateBookingDto) {
        return this.bookingService.update(header, bookingUId, updateBookingDto);
    }
    remove(header, bookingUId) {
        return this.bookingService.remove(header, bookingUId);
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filter', required: false }),
    (0, common_1.Get)('admin/booking/all'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('filter')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, String, Number]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "findAllAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filter', required: false }),
    (0, common_1.Get)('admin/agent/booking/:agentUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('agentUId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('filter')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, String, String, Number]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "findOneAgentByAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filter', required: false }),
    (0, common_1.Get)('agent/booking'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('filter')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, String, Number]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "findAllAgent", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('agent/booking/details/:bookingUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "findOneAgent", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('admin/agent/booking/details/:bookingUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "findOneBookingAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('agent/booking/past'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "findPastFlightAgentId", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('agent/booking/upcoming'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "findUpcomingFlightAgentId", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('agent/booking/calendare/:yearMonth'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('yearMonth')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "findCalendareByAgentId", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({ summary: "Update All Booking, PNR", description: "Admin Can Access" }),
    (0, common_1.Patch)('admin/booking/:bookingUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, booking_model_1.BookingModelUpdateAdmin]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Delete)('admin/booking/:bookingUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "remove", null);
exports.BookingController = BookingController = __decorate([
    (0, swagger_1.ApiTags)("Booking Modules"),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
//# sourceMappingURL=booking.controller.js.map
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
exports.TicketingController = void 0;
const common_1 = require("@nestjs/common");
const ticketing_service_1 = require("./ticketing.service");
const swagger_1 = require("@nestjs/swagger");
const ticketing_model_1 = require("./ticketing.model");
let TicketingController = class TicketingController {
    constructor(ticketingService) {
        this.ticketingService = ticketingService;
    }
    ticketIssueRequest(header, bookingUId, payment) {
        return this.ticketingService.ticketIssueRequest(header, bookingUId, payment);
    }
    createTicket(header, bookingUId, makeTicketingDto) {
        return this.ticketingService.createTicket(header, bookingUId, makeTicketingDto);
    }
    rejectTicket(header, bookingUId, remarks) {
        return this.ticketingService.rejectTicket(header, bookingUId, remarks);
    }
};
exports.TicketingController = TicketingController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('agent/ticketing/issue/request/:bookingUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __param(2, (0, common_1.Query)('payment')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], TicketingController.prototype, "ticketIssueRequest", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('admin/ticketing/make/:bookingUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ticketing_model_1.MakeTicketModel]),
    __metadata("design:returntype", void 0)
], TicketingController.prototype, "createTicket", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('admin/ticketing/reject/:bookingUId/:remarks'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __param(2, (0, common_1.Param)('remarks')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], TicketingController.prototype, "rejectTicket", null);
exports.TicketingController = TicketingController = __decorate([
    (0, swagger_1.ApiTags)('Ticketing Modules'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [ticketing_service_1.TicketingService])
], TicketingController);
//# sourceMappingURL=ticketing.controller.js.map
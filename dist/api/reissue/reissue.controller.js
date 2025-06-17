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
exports.ReissueController = void 0;
const common_1 = require("@nestjs/common");
const reissue_service_1 = require("./reissue.service");
const reissue_model_1 = require("./reissue.model");
const swagger_1 = require("@nestjs/swagger");
let ReissueController = class ReissueController {
    constructor(reissueService) {
        this.reissueService = reissueService;
    }
    createagentreaquest(header, bookingUId, createReissueDto) {
        return this.reissueService.createAgentRequest(header, bookingUId, createReissueDto);
    }
    sendquatation(header, bookingUId, quotationReissueDto) {
        return this.reissueService.sendQuotation(header, bookingUId, quotationReissueDto);
    }
    quatationDecision(header, status, bookingUId) {
        return this.reissueService.reissueTicketRequest(header, status, bookingUId);
    }
    reissueDecision(header, status, bookingUId) {
        return this.reissueService.reissueDecisionAdmin(header, status, bookingUId);
    }
};
exports.ReissueController = ReissueController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('agent/reissue/request/:bookingUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, reissue_model_1.ReissueRequestModel]),
    __metadata("design:returntype", void 0)
], ReissueController.prototype, "createagentreaquest", null);
__decorate([
    (0, common_1.Post)('admin/reissue/quotation/:bookingUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, reissue_model_1.ReissueQuotation]),
    __metadata("design:returntype", void 0)
], ReissueController.prototype, "sendquatation", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('agent/reissue/decision/:status/:bookingUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('status')),
    __param(2, (0, common_1.Param)('bookingUId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ReissueController.prototype, "quatationDecision", null);
__decorate([
    (0, common_1.Get)('admin/reissue/ticket/decision/:status/:bookingUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('status')),
    __param(2, (0, common_1.Param)('bookingUId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ReissueController.prototype, "reissueDecision", null);
exports.ReissueController = ReissueController = __decorate([
    (0, swagger_1.ApiTags)('Reissue Modules'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [reissue_service_1.ReissueService])
], ReissueController);
//# sourceMappingURL=reissue.controller.js.map
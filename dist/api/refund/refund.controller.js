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
exports.RefundController = void 0;
const common_1 = require("@nestjs/common");
const refund_service_1 = require("./refund.service");
const swagger_1 = require("@nestjs/swagger");
const refund_model_1 = require("./refund.model");
let RefundController = class RefundController {
    constructor(refundService) {
        this.refundService = refundService;
    }
    createAgentReaquest(header, bookingUId, createRefundDto) {
        return this.refundService.createAgentRequest(header, bookingUId, createRefundDto);
    }
    sendQuotation(header, bookingUId, quotationRefundDto) {
        return this.refundService.sendQuotation(header, bookingUId, quotationRefundDto);
    }
    quotationDecision(header, bookingUId, status) {
        return this.refundService.quotationDecision(header, status, bookingUId);
    }
    refundDecision(header, bookingUId, status, refundDecisionDto) {
        return this.refundService.refundDecision(header, status, bookingUId, refundDecisionDto);
    }
};
exports.RefundController = RefundController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('agent/refund/request/:bookingUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, refund_model_1.RefundRequestModel]),
    __metadata("design:returntype", void 0)
], RefundController.prototype, "createAgentReaquest", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('admin/refund/quotation/:bookingUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, refund_model_1.RefundQuotation]),
    __metadata("design:returntype", void 0)
], RefundController.prototype, "sendQuotation", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('agent/refund/quotation/:status/:bookingUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __param(2, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], RefundController.prototype, "quotationDecision", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('admin/refund/:status/:bookingUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __param(2, (0, common_1.Param)('status')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, refund_model_1.RefundDecisionModel]),
    __metadata("design:returntype", void 0)
], RefundController.prototype, "refundDecision", null);
exports.RefundController = RefundController = __decorate([
    (0, swagger_1.ApiTags)("Refund Modules"),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [refund_service_1.RefundService])
], RefundController);
//# sourceMappingURL=refund.controller.js.map
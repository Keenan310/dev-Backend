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
exports.BkashController = void 0;
const common_1 = require("@nestjs/common");
const bkash_service_1 = require("./bkash.service");
const swagger_1 = require("@nestjs/swagger");
let BkashController = class BkashController {
    constructor(bkashService) {
        this.bkashService = bkashService;
    }
    createPayment(agentUId, amount) {
        return this.bkashService.createPayment(agentUId, amount);
    }
    getPayment(paymentID, status, res) {
        if (paymentID !== '') {
            new common_1.NotFoundException('Payment ID Not Found');
        }
        if (status !== '') {
            new common_1.NotFoundException('Status ID Not Found');
        }
        if (status === 'failure') {
            return res.redirect('https://b2b.etripzone.com/payment/failure');
        }
        else if (status === 'cancel') {
            return res.redirect('https://b2b.etripzone.com/payment/cancel');
        }
        return this.bkashService.executePayment(paymentID, status, res);
    }
    refundPayment(depositUId) {
        return this.bkashService.refundPayment(depositUId);
    }
    searchPayment(transactionId) {
        return this.bkashService.searchPayment(transactionId);
    }
    queryPayment(paymentId) {
        return this.bkashService.searchPayment(paymentId);
    }
};
exports.BkashController = BkashController;
__decorate([
    (0, common_1.Post)(':amount/:agentUId'),
    __param(0, (0, common_1.Param)('agentUId')),
    __param(1, (0, common_1.Param)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], BkashController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Get)('callback'),
    __param(0, (0, common_1.Query)('paymentID')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], BkashController.prototype, "getPayment", null);
__decorate([
    (0, common_1.Post)('refund/:agentUId'),
    __param(0, (0, common_1.Param)('depositUId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BkashController.prototype, "refundPayment", null);
__decorate([
    (0, common_1.Get)('search/:transactionId'),
    __param(0, (0, common_1.Param)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BkashController.prototype, "searchPayment", null);
__decorate([
    (0, common_1.Get)('search/:paymentId'),
    __param(0, (0, common_1.Param)('paymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BkashController.prototype, "queryPayment", null);
exports.BkashController = BkashController = __decorate([
    (0, swagger_1.ApiTags)('PGW Bkash'),
    (0, common_1.Controller)('pgw/bkash'),
    __metadata("design:paramtypes", [bkash_service_1.BkashService])
], BkashController);
//# sourceMappingURL=bkash.controller.js.map
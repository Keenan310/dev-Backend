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
exports.PartialpaymentController = void 0;
const common_1 = require("@nestjs/common");
const partialpayment_service_1 = require("./partialpayment.service");
const swagger_1 = require("@nestjs/swagger");
const update_partialpayment_dto_1 = require("./dto/update-partialpayment.dto");
let PartialpaymentController = class PartialpaymentController {
    constructor(partialpaymentService) {
        this.partialpaymentService = partialpaymentService;
    }
    findAllAdmin(header, page, status, filter, limit) {
        if (limit > 100 || limit < 10) {
            throw new common_1.NotAcceptableException("Maximum Limit must be 10-100");
        }
        {
            return this.partialpaymentService.findAllAdmin(header, page, status, filter, limit);
        }
    }
    updateOneAdmin(header, uid, updatePartialpaymentDto) {
        return this.partialpaymentService.updateOneAdmin(header, uid, updatePartialpaymentDto);
    }
    findAllAgent(header, page, status, filter, limit) {
        if (limit > 100 || limit < 10) {
            throw new common_1.NotAcceptableException("Maximum Limit must be 10-100");
        }
        {
            return this.partialpaymentService.findAllAgent(header, page, status, filter, limit);
        }
    }
    payduePartialPayment(header, uid) {
        return this.partialpaymentService.paydue(header, uid);
    }
};
exports.PartialpaymentController = PartialpaymentController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filter', required: false }),
    (0, common_1.Get)('admin/partial/payment'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('filter')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, String, Number]),
    __metadata("design:returntype", void 0)
], PartialpaymentController.prototype, "findAllAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Patch)('admin/partial/payment/:uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_partialpayment_dto_1.UpdatePartialpaymentDto]),
    __metadata("design:returntype", void 0)
], PartialpaymentController.prototype, "updateOneAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filter', required: false }),
    (0, common_1.Get)('agent/partial/payment'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('filter')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, String, Number]),
    __metadata("design:returntype", void 0)
], PartialpaymentController.prototype, "findAllAgent", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('agent/partial/payment/pay/due/:uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PartialpaymentController.prototype, "payduePartialPayment", null);
exports.PartialpaymentController = PartialpaymentController = __decorate([
    (0, swagger_1.ApiTags)('Partial Payment'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [partialpayment_service_1.PartialpaymentService])
], PartialpaymentController);
//# sourceMappingURL=partialpayment.controller.js.map
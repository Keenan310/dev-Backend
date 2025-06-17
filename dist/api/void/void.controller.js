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
exports.VoidController = void 0;
const common_1 = require("@nestjs/common");
const void_service_1 = require("./void.service");
const swagger_1 = require("@nestjs/swagger");
const void_model_1 = require("./void.model");
let VoidController = class VoidController {
    constructor(voidService) {
        this.voidService = voidService;
    }
    createVoidRequest(header, bookingUId, createVoidDto) {
        return this.voidService.createVoidRequest(header, bookingUId, createVoidDto);
    }
    voidDecision(header, bookingUId, status, servicefee) {
        return this.voidService.voidDecision(header, bookingUId, status, servicefee);
    }
};
exports.VoidController = VoidController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('agent/void/request/:bookingUId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, void_model_1.VoidModel]),
    __metadata("design:returntype", void 0)
], VoidController.prototype, "createVoidRequest", null);
__decorate([
    (0, common_1.Post)('admin/void/request/:bookingUId/:status/:servicefee'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __param(2, (0, common_1.Param)('status')),
    __param(3, (0, common_1.Param)('servicefee')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number]),
    __metadata("design:returntype", void 0)
], VoidController.prototype, "voidDecision", null);
exports.VoidController = VoidController = __decorate([
    (0, swagger_1.ApiTags)("Void Modules"),
    (0, common_1.Controller)(''),
    __metadata("design:paramtypes", [void_service_1.VoidService])
], VoidController);
//# sourceMappingURL=void.controller.js.map
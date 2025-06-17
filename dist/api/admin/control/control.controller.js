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
exports.ControlController = void 0;
const common_1 = require("@nestjs/common");
const control_service_1 = require("./control.service");
const swagger_1 = require("@nestjs/swagger");
let ControlController = class ControlController {
    constructor(controlService) {
        this.controlService = controlService;
    }
    findOne(header) {
        return this.controlService.findOne(header);
    }
    update(header, status) {
        return this.controlService.update(header, status);
    }
};
exports.ControlController = ControlController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ControlController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ControlController.prototype, "update", null);
exports.ControlController = ControlController = __decorate([
    (0, swagger_1.ApiExcludeController)(),
    (0, swagger_1.ApiTags)('Admin Control'),
    (0, common_1.Controller)('admin/control'),
    __metadata("design:paramtypes", [control_service_1.ControlService])
], ControlController);
//# sourceMappingURL=control.controller.js.map
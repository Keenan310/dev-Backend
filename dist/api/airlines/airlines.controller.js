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
exports.AirlinesController = void 0;
const common_1 = require("@nestjs/common");
const airlines_service_1 = require("./airlines.service");
const swagger_1 = require("@nestjs/swagger");
const airlines_model_1 = require("./airlines.model");
let AirlinesController = class AirlinesController {
    constructor(airlinesService) {
        this.airlinesService = airlinesService;
    }
    findAll(header) {
        return this.airlinesService.findAll(header);
    }
    updatemarkup(header, id, updateAirlineDto) {
        return this.airlinesService.update(header, +id, updateAirlineDto);
    }
};
exports.AirlinesController = AirlinesController;
__decorate([
    (0, common_1.Get)('admin/airlines/all'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AirlinesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)('admin/airlines/markup/:id'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, airlines_model_1.AirlinesUpdateModel]),
    __metadata("design:returntype", void 0)
], AirlinesController.prototype, "updatemarkup", null);
exports.AirlinesController = AirlinesController = __decorate([
    (0, swagger_1.ApiExcludeController)(),
    (0, swagger_1.ApiTags)("Admin Module"),
    (0, common_1.Controller)(),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [airlines_service_1.AirlinesService])
], AirlinesController);
//# sourceMappingURL=airlines.controller.js.map
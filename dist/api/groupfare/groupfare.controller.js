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
exports.GroupfareController = void 0;
const common_1 = require("@nestjs/common");
const groupfare_service_1 = require("./groupfare.service");
const groupfare_model_1 = require("./groupfare.model");
const swagger_1 = require("@nestjs/swagger");
const cache_manager_1 = require("@nestjs/cache-manager");
let GroupfareController = class GroupfareController {
    constructor(groupfareService) {
        this.groupfareService = groupfareService;
    }
    create(header, groupFare) {
        return this.groupfareService.create(header, groupFare);
    }
    findAllAdmin(header) {
        return this.groupfareService.findAllAdmin(header);
    }
    findAllAgent(header) {
        return this.groupfareService.findAllAgent(header);
    }
    findOneAdmin(header, uid) {
        return this.groupfareService.findOneAdmin(header, uid);
    }
    remove(header, uid) {
        return this.groupfareService.remove(header, uid);
    }
};
exports.GroupfareController = GroupfareController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, groupfare_model_1.GroupFareDto]),
    __metadata("design:returntype", void 0)
], GroupfareController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GroupfareController.prototype, "findAllAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GroupfareController.prototype, "findAllAgent", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('admin/:uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GroupfareController.prototype, "findOneAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Delete)(':uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GroupfareController.prototype, "remove", null);
exports.GroupfareController = GroupfareController = __decorate([
    (0, swagger_1.ApiTags)('GroupFare Modules'),
    (0, common_1.Controller)('groupfare'),
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    __metadata("design:paramtypes", [groupfare_service_1.GroupfareService])
], GroupfareController);
//# sourceMappingURL=groupfare.controller.js.map
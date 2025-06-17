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
exports.NoticeController = void 0;
const common_1 = require("@nestjs/common");
const notice_service_1 = require("./notice.service");
const notice_model_1 = require("./notice.model");
const swagger_1 = require("@nestjs/swagger");
let NoticeController = class NoticeController {
    constructor(noticeService) {
        this.noticeService = noticeService;
    }
    create(header, createNoticeDto) {
        return this.noticeService.create(header, createNoticeDto);
    }
    findAllNoticeAdmin(header) {
        return this.noticeService.findAllAdmin(header);
    }
    findAllNoticeAgent(header) {
        return this.noticeService.findAllAgent(header);
    }
    update(header, uid, updateNoticeDto) {
        return this.noticeService.update(header, uid, updateNoticeDto);
    }
    remove(header, uid) {
        return this.noticeService.remove(header, uid);
    }
};
exports.NoticeController = NoticeController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('admin/notice'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, notice_model_1.NoticeModel]),
    __metadata("design:returntype", void 0)
], NoticeController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('admin/notice/all'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NoticeController.prototype, "findAllNoticeAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('agent/notice/all'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NoticeController.prototype, "findAllNoticeAgent", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Patch)('admin/notice/:uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, notice_model_1.NoticeUpdateModel]),
    __metadata("design:returntype", void 0)
], NoticeController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Delete)('admin/notice/:uid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NoticeController.prototype, "remove", null);
exports.NoticeController = NoticeController = __decorate([
    (0, swagger_1.ApiTags)("Notice"),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [notice_service_1.NoticeService])
], NoticeController);
//# sourceMappingURL=notice.controller.js.map
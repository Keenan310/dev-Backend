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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const upload_service_1 = require("./upload.service");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const agent_model_1 = require("../agent/agent.model");
let UploadController = class UploadController {
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    signUp(agentDto, files) {
        const allowfileType = ["image/jpg", "image/png", "image/jpeg", "image/gif", "application/pdf"];
        if (!allowfileType.includes(files?.nid?.[0]?.mimetype)) {
            throw new common_1.NotAcceptableException('File Type Must be: ' + allowfileType.join(' , '));
        }
        else if (files?.tl && !allowfileType.includes(files?.tl?.[0]?.mimetype)) {
            throw new common_1.NotAcceptableException('File Type Must be: ' + allowfileType.join(' , '));
        }
        if (files?.nid?.[0]?.size < 7000 || files?.tl?.[0]?.size < 7000) {
            throw new common_1.NotAcceptableException('File Size Must Be less Than 3 MB');
        }
        return this.uploadService.signup(agentDto, files);
    }
    uploadAgentLogo(header, file, res) {
        return this.uploadService.uploadAgentLogo(header, file, res);
    }
    uploadAgentTL(header, file, res) {
        return this.uploadService.uploadAgentTradeLicense(header, file, res);
    }
    uploadDepositFile(header, amount, sender, paymentway, receiver, reference, file, res) {
        if (isNaN(amount)) {
            throw new common_1.HttpException('Invalid amount. Must be a number.', common_1.HttpStatus.BAD_REQUEST);
        }
        else if (!sender || sender.trim() === '') {
            throw new common_1.HttpException('Sender cannot be empty. Must be a non-empty string.', common_1.HttpStatus.BAD_REQUEST);
        }
        else if (!receiver || receiver.trim() === '') {
            throw new common_1.HttpException('Receiver cannot be empty. Must be a non-empty string.', common_1.HttpStatus.BAD_REQUEST);
        }
        else if (!paymentway || paymentway.trim() === '') {
            throw new common_1.HttpException('Paymentway cannot be empty. Must be a non-empty string.', common_1.HttpStatus.BAD_REQUEST);
        }
        else if (!reference || reference.trim() === '') {
            throw new common_1.HttpException('Reference cannot be empty. Must be a non-empty string.', common_1.HttpStatus.BAD_REQUEST);
        }
        else if (!file) {
            throw new common_1.NotFoundException('Please select a file to upload');
        }
        else if (file.size > 3000000) {
            throw new common_1.HttpException('File size exceeds the limit max 3MB', common_1.HttpStatus.FORBIDDEN);
        }
        return this.uploadService.addDeposit(header, amount, sender, receiver, paymentway, reference, file, res);
    }
    addPromotion(header, file, category, res) {
        return this.uploadService.addPromotion(header, category, file, res);
    }
    uploadPassportCopy(docs, paxUId, file, res) {
        return this.uploadService.uploadPassengerDocs(docs, paxUId, file, res);
    }
    uploadReissueTicketCopy(header, bookingUId, file, res) {
        return this.uploadService.uploadReissueTicketCopy(header, bookingUId, file, res);
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, swagger_1.ApiTags)('Agent Sign UP'),
    (0, common_1.Post)('agent/signup'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'nid', maxCount: 1 },
        { name: 'tl', maxCount: 1 },
    ])),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agent_model_1.AgentModel, Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "signUp", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiTags)("Agent Modules"),
    (0, common_1.Post)("agent/upload/logo"),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadAgentLogo", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiTags)("Agent Modules"),
    (0, common_1.Post)("agent/upload/tl"),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadAgentTL", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiTags)("Deposit Modules"),
    (0, common_1.Post)("agent/deposit"),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)('amount')),
    __param(2, (0, common_1.Query)('sender')),
    __param(3, (0, common_1.Query)('paymentway')),
    __param(4, (0, common_1.Query)('receiver')),
    __param(5, (0, common_1.Query)('reference')),
    __param(6, (0, common_1.UploadedFile)()),
    __param(7, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, String, String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadDepositFile", null);
__decorate([
    (0, swagger_1.ApiTags)("Promotion"),
    (0, common_1.Post)("admin/promotion/:category"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Param)('category')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "addPromotion", null);
__decorate([
    (0, swagger_1.ApiTags)("Passengers"),
    (0, common_1.Post)("agent/passenger/upload/:docs/:paxUId"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('docs')),
    __param(1, (0, common_1.Param)('paxUId')),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadPassportCopy", null);
__decorate([
    (0, swagger_1.ApiTags)("Reissue Modules"),
    (0, common_1.Post)("admin/upload/reissue/ticket/:bookingUId"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingUId')),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadReissueTicketCopy", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiExcludeController)(),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map
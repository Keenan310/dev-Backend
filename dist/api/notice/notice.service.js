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
exports.NoticeService = void 0;
const common_1 = require("@nestjs/common");
const notice_model_1 = require("./notice.model");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const auth_service_1 = require("../auth/auth.service");
let NoticeService = class NoticeService {
    constructor(noticeRepository, authService) {
        this.noticeRepository = noticeRepository;
        this.authService = authService;
    }
    async create(header, createNoticeDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        return await this.noticeRepository.save(createNoticeDto);
    }
    async findAllAdmin(header) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        return await this.noticeRepository.find();
    }
    async findAllAgent(header) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        return await this.noticeRepository.find();
    }
    async findOne(header, uid) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        return await this.noticeRepository.findOne({ where: { uid: uid } });
    }
    async update(header, uid, updateNoticeDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const notice = await this.noticeRepository.findOne({
            where: { uid: uid },
        });
        if (!notice) {
            throw new common_1.NotFoundException('Invalid Id');
        }
        return await this.noticeRepository.update(notice.id, updateNoticeDto);
    }
    async remove(header, uid) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const notice = await this.noticeRepository.findOne({
            where: { uid: uid },
        });
        if (!notice) {
            throw new common_1.NotFoundException('Invalid Id');
        }
        return await this.noticeRepository.delete(notice.id);
    }
};
exports.NoticeService = NoticeService;
exports.NoticeService = NoticeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(notice_model_1.NoticeModel)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        auth_service_1.AuthService])
], NoticeService);
//# sourceMappingURL=notice.service.js.map
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
exports.AirlinesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const airlines_model_1 = require("./airlines.model");
const auth_service_1 = require("../auth/auth.service");
let AirlinesService = class AirlinesService {
    constructor(airlinesRepository, airlineDiscountRepository, authService) {
        this.airlinesRepository = airlinesRepository;
        this.airlineDiscountRepository = airlineDiscountRepository;
        this.authService = authService;
    }
    async createAirlineDiscount(header, createAirlineDiscountDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const discount = this.airlineDiscountRepository.create(createAirlineDiscountDto);
        return this.airlineDiscountRepository.save(discount);
    }
    async viewAirlineDiscount(header, currency) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        if (currency && currency.trim() !== '') {
            currency = currency.toUpperCase();
            return await this.airlineDiscountRepository.find({ where: { currency } });
        }
        else {
            return await this.airlineDiscountRepository.find();
        }
    }
    async updateAirlineDiscount(header, id, updateAirlineDiscountDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const data = await this.airlineDiscountRepository.findOneBy({ id: id });
        if (!data) {
            throw new common_1.NotFoundException("Not found");
        }
        return this.airlineDiscountRepository.update(id, updateAirlineDiscountDto);
    }
    async deleteAirlineDiscount(header, id) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const data = await this.airlineDiscountRepository.findOneBy({ id: id });
        if (!data) {
            throw new common_1.NotFoundException("Not found");
        }
        return await this.airlineDiscountRepository.delete(data.id);
    }
    async create(header, createAirlineDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const airlinesData = await this.airlinesRepository.findOne({ where: { iata: createAirlineDto.iata }
        });
        if (airlinesData) {
            throw new common_1.HttpException("Airlines already exist", common_1.HttpStatus.CONFLICT);
        }
        return await this.airlinesRepository.save(createAirlineDto);
    }
    async getAirlines(code) {
        const airlinesData = await this.airlinesRepository.findOne({
            select: ['iata', 'marketing_name', 'soto', 'soti', 'sito', 'domestic', 'addAmount', 'isBlocked', 'issuePermit', 'instantPayment', 'bookable'],
            where: { iata: code }
        });
        if (!airlinesData) {
            return '';
        }
        return airlinesData;
    }
    async getAirlinesName(code) {
        const airlinesData = await this.airlinesRepository.findOne({
            select: ['iata', 'marketing_name'],
            where: { iata: code }
        });
        if (!airlinesData) {
            return '';
        }
        return airlinesData.marketing_name;
    }
    async findAll(header) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const data = await this.airlinesRepository.find({
            select: ['id', 'iata', 'marketing_name', 'soto', 'soti', 'sito', 'domestic', 'addAmount', 'isBlocked', 'issuePermit', 'instantPayment', 'bookable'],
            order: { updatedAt: 'DESC' }
        });
        return data;
    }
    async findOne(header, id) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const airlinesData = await this.airlinesRepository.findOne({ where: { id: id } });
        if (!airlinesData) {
            throw new common_1.NotFoundException("Not found");
        }
        return airlinesData;
    }
    async update(header, id, updateAirlineDto) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const airlinesData = await this.airlinesRepository.findOne({ where: { id: id } });
        if (!airlinesData) {
            throw new common_1.NotFoundException("Not found");
        }
        return await this.airlinesRepository.update(airlinesData.id, updateAirlineDto);
    }
};
exports.AirlinesService = AirlinesService;
exports.AirlinesService = AirlinesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(airlines_model_1.AirlinesModel)),
    __param(1, (0, typeorm_1.InjectRepository)(airlines_model_1.AirlineDiscount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService])
], AirlinesService);
//# sourceMappingURL=airlines.service.js.map
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
exports.SearchhistoryService = void 0;
const common_1 = require("@nestjs/common");
const searchhistory_model_1 = require("./searchhistory.model");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_service_1 = require("../auth/auth.service");
const agent_model_1 = require("../agent/agent.model");
let SearchhistoryService = class SearchhistoryService {
    constructor(searchHistoryRepository, agentRepository, authService) {
        this.searchHistoryRepository = searchHistoryRepository;
        this.agentRepository = agentRepository;
        this.authService = authService;
    }
    async create(agentdata, flightDto) {
        const shModel = new searchhistory_model_1.SearchHistoryModel();
        shModel.agentId = agentdata.agentId;
        shModel.companyname = agentdata.company;
        shModel.triptype = flightDto.segments?.[0].depfrom == flightDto.segments?.[0].arrto ? 'Return' : 'Oneway';
        shModel.adult = flightDto.adultcount;
        shModel.child = flightDto.childcount;
        shModel.infant = flightDto.infantcount;
        shModel.depfrom = flightDto.segments?.[0].depfrom;
        shModel.arrto = flightDto.segments?.[0].arrto;
        shModel.depdate = flightDto.segments?.[0]?.depdate;
        shModel.returndate = flightDto.segments?.[1]?.depdate;
        return await this.searchHistoryRepository.save(shModel);
    }
    async todaysearch(headers) {
        const verifyAdminId = await this.authService.verifyAdminToken(headers);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return await this.searchHistoryRepository.find({
            where: {
                created_at: (0, typeorm_2.MoreThan)(startOfToday),
            },
            order: {
                created_at: 'DESC',
            },
        });
    }
    async findByAgentId(header) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const search_histories = await this.searchHistoryRepository.find({
            where: { agentId: agent.agentId },
            order: { created_at: 'DESC' },
            take: 20,
        });
        if (!search_histories) {
            throw new common_1.NotFoundException('No data found');
        }
        return search_histories;
    }
};
exports.SearchhistoryService = SearchhistoryService;
exports.SearchhistoryService = SearchhistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(searchhistory_model_1.SearchHistoryModel)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService])
], SearchhistoryService);
//# sourceMappingURL=searchhistory.service.js.map
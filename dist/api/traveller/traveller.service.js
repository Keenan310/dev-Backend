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
exports.TravellerService = void 0;
const common_1 = require("@nestjs/common");
const traveller_model_1 = require("./traveller.model");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agent_model_1 = require("../agent/agent.model");
const auth_service_1 = require("../auth/auth.service");
let TravellerService = class TravellerService {
    constructor(TravellerRepository, agentRepository, authService) {
        this.TravellerRepository = TravellerRepository;
        this.agentRepository = agentRepository;
        this.authService = authService;
    }
    async create(header, createTravellerDto) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        createTravellerDto['agentId'] = agent.agentId;
        return await this.TravellerRepository.save(createTravellerDto);
    }
    async findAllByAgentId(header) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        return await this.TravellerRepository.find({ where: { agentId: agent.agentId } });
        ;
    }
    async findOne(header, uid) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        return await this.TravellerRepository.findOne({ where: { uid: uid } });
    }
    async update(header, uid, updateTravellerDto) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const Traveller = await this.TravellerRepository.findOne({ where: { uid: uid } });
        if (!Traveller) {
            throw new common_1.NotFoundException('Traveller not found');
        }
        return await this.TravellerRepository.update(Traveller.id, updateTravellerDto);
    }
    async remove(header, uid) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const Traveller = await this.TravellerRepository.findOne({ where: { uid: uid } });
        if (!Traveller) {
            throw new common_1.NotFoundException('Traveller not found');
        }
        return this.TravellerRepository.delete(Traveller.id);
    }
    async createBookingPax(TravellerData, agentId, bookingId) {
        const adult = (TravellerData?.adult).length || 1;
        const child = (TravellerData?.child).length || 0;
        const infant = (TravellerData?.infant).length || 0;
        const paxData = [];
        if (adult > 0) {
            for (const adultPax of TravellerData?.adult) {
                const prefix = adultPax.gender == 'Male' ? 'MR' : 'MS';
                const adultInfo = {
                    agentId: agentId,
                    prefix: prefix,
                    givenname: adultPax?.givenname.toUpperCase(),
                    surname: adultPax?.surname.toUpperCase(),
                    gender: adultPax?.gender.toUpperCase(),
                    dob: adultPax?.dob,
                    type: "ADT",
                    document: adultPax?.document.toUpperCase(),
                    expiredate: adultPax?.expiredate,
                    nationality: adultPax?.nationality.toUpperCase(),
                };
                const Traveller = await this.TravellerRepository.findOne({
                    where: { document: adultPax?.document.toUpperCase() },
                });
                if (!Traveller) {
                    paxData.push(adultInfo);
                }
                else {
                    paxData.push(adultInfo);
                }
            }
        }
        if (child > 0) {
            for (const childPax of TravellerData?.child) {
                const prefix = childPax.gender == 'Male' ? 'MSTR' : 'MISS';
                const childInfo = {
                    agentId: agentId,
                    prefix: prefix,
                    givenname: childPax.givenname.toUpperCase(),
                    surname: childPax.surname.toUpperCase(),
                    gender: childPax.gender.toUpperCase(),
                    dob: childPax.dob,
                    type: "CNN",
                    document: childPax.document.toUpperCase(),
                    expiredate: childPax.expiredate,
                    nationality: childPax.nationality.toUpperCase(),
                };
                const Traveller = await this.TravellerRepository.findOne({
                    where: { document: childPax?.document.toUpperCase() },
                });
                if (!Traveller) {
                    paxData.push(childInfo);
                }
                else {
                    paxData.push(childInfo);
                }
            }
        }
        if (infant > 0) {
            for (const infantPax of TravellerData?.infant) {
                const prefix = infantPax.gender == 'Male' ? 'MSTR' : 'MISS';
                const infantInfo = {
                    agentId: agentId,
                    prefix: prefix,
                    givenname: infantPax.givenname.toUpperCase(),
                    surname: infantPax.surname.toUpperCase(),
                    gender: infantPax.gender.toUpperCase(),
                    dob: infantPax.dob,
                    type: "INF",
                    document: infantPax.document.toUpperCase(),
                    expiredate: infantPax.expiredate,
                    nationality: infantPax.nationality.toUpperCase(),
                };
                const Traveller = await this.TravellerRepository.findOne({
                    where: { document: infantPax?.document.toUpperCase() },
                });
                if (!Traveller) {
                    paxData.push(infantInfo);
                }
                else {
                    paxData.push(infantInfo);
                }
            }
        }
        await this.TravellerRepository.save(paxData);
    }
};
exports.TravellerService = TravellerService;
exports.TravellerService = TravellerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(traveller_model_1.TravellerModel)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService])
], TravellerService);
//# sourceMappingURL=traveller.service.js.map
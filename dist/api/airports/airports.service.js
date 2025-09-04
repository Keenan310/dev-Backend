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
exports.AirportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const airports_model_1 = require("./airports.model");
const typeorm_2 = require("typeorm");
const auth_service_1 = require("../auth/auth.service");
let AirportsService = class AirportsService {
    constructor(airportsRepository, authService) {
        this.airportsRepository = airportsRepository;
        this.authService = authService;
    }
    async create(createAirportDto) {
        const airportData = await this.airportsRepository.findOne({ where: { iata: createAirportDto.iata }
        });
        if (airportData) {
            throw new common_1.HttpException("Airport already exist", common_1.HttpStatus.CONFLICT);
        }
        return this.airportsRepository.create(createAirportDto);
    }
    async findAll() {
        return this.airportsRepository.find();
    }
    async search(header, query) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        if (!query)
            return [];
        let results = [];
        if (query.length === 3) {
            results = await this.airportsRepository.find({
                where: { iata: query.toUpperCase() },
            });
        }
        else {
            results = await this.airportsRepository.find({
                where: [
                    { name: (0, typeorm_2.ILike)(`%${query}%`) },
                    { city_code: (0, typeorm_2.ILike)(`%${query}%`) },
                    { country_code: (0, typeorm_2.ILike)(`%${query}%`) },
                ],
            });
        }
        return results.map((a) => ({
            code: a.iata,
            name: a.name,
            location: a.city_code + ', ' + a.country_code,
        }));
    }
    async findFormateAll() {
        return this.airportsRepository.find({
            select: [
                'iata',
                'name',
                'city_code',
                'country_code',
                'timezone',
                'utc',
                'latitude',
                'longitude',
            ],
        });
    }
    async findOne(id) {
        const airportData = await this.airportsRepository.findOne({ where: { id: id }
        });
        if (airportData) {
            throw new common_1.NotFoundException("Aiport doesn't exist");
        }
        return airportData;
    }
    async update(id, updateAirportDto) {
        const airportData = await this.airportsRepository.findOne({ where: { id: id }
        });
        if (airportData) {
            throw new common_1.NotFoundException("Aiport doesn't exist");
        }
        return this.airportsRepository.update(airportData[0].id, updateAirportDto);
    }
    async remove(id) {
        const airportData = await this.airportsRepository.findOne({ where: { id: id }
        });
        if (airportData) {
            throw new common_1.NotFoundException("Aiport doesn't exist");
        }
        return this.airportsRepository.remove(airportData[0].id);
    }
    async getAirportName(code) {
        const airportsData = await this.airportsRepository.findOne({ where: { iata: code } });
        if (!airportsData) {
            return "Not Found";
        }
        return airportsData.name;
    }
    async getAirportLocation(code) {
        const airportsData = await this.airportsRepository.findOne({ where: { iata: code } });
        if (!airportsData) {
            return "Not Found";
        }
        return airportsData.city_code + "," + airportsData.country_code;
    }
    async getCountry(code) {
        const airportsData = await this.airportsRepository.findOne({ where: { iata: code } });
        if (!airportsData) {
            return "Not Found";
        }
        return airportsData.country_code;
    }
};
exports.AirportsService = AirportsService;
exports.AirportsService = AirportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(airports_model_1.AirportsModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_service_1.AuthService])
], AirportsService);
//# sourceMappingURL=airports.service.js.map
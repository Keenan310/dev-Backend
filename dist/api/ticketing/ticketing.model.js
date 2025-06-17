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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeTicketModel = exports.passengerModel = exports.TicketModel = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let TicketModel = class TicketModel {
};
exports.TicketModel = TicketModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TicketModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TicketModel.prototype, "agentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TicketModel.prototype, "bookingId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TicketModel.prototype, "vendor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TicketModel.prototype, "system", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TicketModel.prototype, "airlines", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TicketModel.prototype, "bookingpnr", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TicketModel.prototype, "airlinespnr", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TicketModel.prototype, "givenname", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TicketModel.prototype, "surname", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TicketModel.prototype, "ticketnumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TicketModel.prototype, "issuetype", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TicketModel.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TicketModel.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Generated)('uuid'),
    __metadata("design:type", String)
], TicketModel.prototype, "uid", void 0);
exports.TicketModel = TicketModel = __decorate([
    (0, typeorm_1.Entity)('ticketed')
], TicketModel);
class passengerModel {
}
exports.passengerModel = passengerModel;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Kayes' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], passengerModel.prototype, "givenname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Fahim' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], passengerModel.prototype, "surname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '123456789000' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], passengerModel.prototype, "ticketnumber", void 0);
class MakeTicketModel {
}
exports.MakeTicketModel = MakeTicketModel;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'TripLover' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MakeTicketModel.prototype, "vendor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Sabre' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MakeTicketModel.prototype, "system", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'XDGHJK' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MakeTicketModel.prototype, "bookingpnr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'XDG3JK' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MakeTicketModel.prototype, "airlinespnr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'manual' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MakeTicketModel.prototype, "issuetype", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '0' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MakeTicketModel.prototype, "purchaseprice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '0' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MakeTicketModel.prototype, "sellprice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [passengerModel] }),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(9),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], MakeTicketModel.prototype, "passengerInfo", void 0);
//# sourceMappingURL=ticketing.model.js.map
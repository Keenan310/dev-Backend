"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUtils = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();
let AuthUtils = class AuthUtils {
    async encrypt(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }
    async getPublicIp() {
        try {
            const response = await axios_1.default.get('https://ifconfig.me/ip');
            return response.data.trim();
        }
        catch (error) {
            throw new Error('Failed to fetch public IP');
        }
    }
    async generateOTP() {
        return Math.floor(Math.random() * (999999 - 1 + 1)) + 1;
    }
    async generateRandomPassword() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters.charAt(randomIndex);
        }
        return password;
    }
};
exports.AuthUtils = AuthUtils;
exports.AuthUtils = AuthUtils = __decorate([
    (0, common_1.Injectable)()
], AuthUtils);
//# sourceMappingURL=auth.utils.js.map
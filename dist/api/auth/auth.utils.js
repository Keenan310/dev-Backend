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
const crypto_1 = require("crypto");
const dotenv = require("dotenv");
const util_1 = require("util");
dotenv.config();
let AuthUtils = class AuthUtils {
    async encrypt(password) {
        const secret = process.env.PASSWORD_SECRET_KEY;
        const iv = process.env.PASSWORD_SECRET_IV;
        try {
            const key = (await (0, util_1.promisify)(crypto_1.scrypt)(secret, 'salt', 32));
            const cipher = (0, crypto_1.createCipheriv)('aes-256-ctr', key, iv);
            let encryptedPassword = cipher.update(password, 'utf8', 'hex');
            encryptedPassword += cipher.final('hex');
            return encryptedPassword;
        }
        catch (error) {
            throw error;
        }
    }
    async decrypt(password) {
        const secret = process.env.PASSWORD_SECRET_KEY;
        const iv = process.env.PASSWORD_SECRET_IV;
        try {
            const key = (await (0, util_1.promisify)(crypto_1.scrypt)(secret, 'salt', 32));
            const decipher = (0, crypto_1.createDecipheriv)('aes-256-ctr', key, iv);
            let decryptedPassword = decipher.update(password, 'hex', 'utf8');
            decryptedPassword += decipher.final('utf8');
            return decryptedPassword;
        }
        catch (error) {
            throw error;
        }
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
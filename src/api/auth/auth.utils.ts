import { Injectable } from "@nestjs/common";
import axios from "axios";
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import * as dotenv from "dotenv";
import { promisify } from "util";
dotenv.config()

@Injectable()
export class AuthUtils {

    async encrypt(password : string) {
        const secret = process.env.PASSWORD_SECRET_KEY;
        const iv = process.env.PASSWORD_SECRET_IV;
        try {

            const key = (await promisify(scrypt)(secret, 'salt', 32)) as Buffer;
            const cipher = createCipheriv('aes-256-ctr', key, iv);

            let encryptedPassword = cipher.update(password, 'utf8', 'hex');
            encryptedPassword += cipher.final('hex');
    
            return encryptedPassword;
        } catch (error) {
            throw error;
        }
    }
    
    async decrypt(password : string) {
        const secret = process.env.PASSWORD_SECRET_KEY;
        const iv = process.env.PASSWORD_SECRET_IV;
        try {
            const key = (await promisify(scrypt)(secret, 'salt', 32)) as Buffer;
            const decipher = createDecipheriv('aes-256-ctr', key, iv);
            let decryptedPassword = decipher.update(password, 'hex', 'utf8');
            decryptedPassword += decipher.final('utf8');
    
            return decryptedPassword;
        } catch (error) {
            throw error;
        }
    }

    async getPublicIp(): Promise<string> {
        try {
          const response = await axios.get('https://ifconfig.me/ip');
          return response.data.trim();
        } catch (error) {
          throw new Error('Failed to fetch public IP');
        }
    }

    async generateOTP(){
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

}
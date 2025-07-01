import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as dotenv from "dotenv";
import * as bcrypt from 'bcrypt';
dotenv.config()

@Injectable()
export class AuthUtils {

    async encrypt(password : string) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
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
export declare class AuthUtils {
    encrypt(password: string): Promise<string>;
    decrypt(password: string): Promise<string>;
    getPublicIp(): Promise<string>;
    generateOTP(): Promise<number>;
    generateRandomPassword(): Promise<string>;
}

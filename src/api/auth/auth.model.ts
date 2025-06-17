import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export class AuthModel {
    @ApiProperty({ default: 'dev@flyjatt.com' })
    email: string;

    @ApiProperty({default: "12345678"})
    password: string;

}

@Entity('otp')
export class OTPModel {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    code: string;

    @Column()
    agentUId: string;

    @Column()
    created_at : Date
}
import { ApiProperty } from "@nestjs/swagger";
import { integer } from "aws-sdk/clients/cloudfront";
import { IsAlpha, IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, Generated, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity('bank_accounts')
export class BankListModel{

    @PrimaryGeneratedColumn()
    id: string;
  
    @Column()
    agentId: string;
  
    @ApiProperty()
    @Column()
    @IsNotEmpty()
    @IsString()
    bankname: string;
  
    @ApiProperty()
    @Column()
    @IsNotEmpty()
    @IsString()
    accountname: string;
  
    @ApiProperty()
    @Column()
    @IsNotEmpty()
    @IsString()
    accountnumber: string;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    @IsString()
    iban: string;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    @IsString()
    branch: string;

    @ApiProperty()
    @Column()
    @IsString()
    routingno: string;

    @ApiProperty()
    @Column()
    logo: string;
  
    @Column({ name: 'created_at' })
    createdAt: string;
  
    @Column({ name: 'updated_at' })
    updatedAt: string;
  
    @Column()
    @Generated("uuid")
    uid: string;

}
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";


@Entity('reissue')
export class ReissueModel{

    @PrimaryGeneratedColumn()
    id: string;
    
    @Column()
    @IsString()
    @IsNotEmpty()
    agentId: string;
    
    @Column()
    @IsString()
    @IsNotEmpty()
    bookingId: string;
    
    @Column()
    @IsString()
    @IsNotEmpty()
    passengerdata: string;

    
    @Column()
    @IsString()
    @IsNotEmpty()
    quotationtext: string;
    
    @Column()
    @IsString()
    @IsNotEmpty()
    quotationcopy: string;
    
    @Column()
    @IsNumber()
    @IsNotEmpty()
    quotationamount: number;
    
    @Column()
    @IsNumber()
    @IsNotEmpty()
    exchangepenalty: number;
    
    @Column()
    @IsNumber()
    @IsNotEmpty()
    faredifference: number;
    
    @Column()
    @IsNumber()
    @IsNotEmpty()
    servicefee: number;
    
    @Column()
    @IsDate()
    @IsNotEmpty()
    reissuedate: string;
    
    @Column()
    @IsString()
    @IsNotEmpty()
    remarks: string;
   
    @Column()
    @IsString()
    @IsNotEmpty()
    reissuecopy: string;
    
    @Column()
    @IsDate()
    @IsNotEmpty()
    created_at: Date;
    
    @Column()
    @IsDate()
    @IsNotEmpty()
    updated_at: Date;
    
    @Column()
    @Generated('uuid')
    uid: string;

}

export class ReissueRequestModel{

    @ApiProperty({default: "Given name/Surname-TicketNumber-Reissuedate"})
    @IsNotEmpty()
    @IsString()
    text: string;

    @ApiProperty({default: "2024-12-12"})
    @IsNotEmpty()
    date: string;
    
}

export class ReissueQuotation{

    @ApiProperty()
    @IsNotEmpty()
    quotationamount: number;

    @ApiProperty()
    @IsNotEmpty()
    exchangepenalty: number;
    
    @ApiProperty()
    @IsNotEmpty()
    faredifference: number;
    
    @ApiProperty()
    @IsNotEmpty()
    servicefee: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    quotationtext: string;

    @ApiPropertyOptional()
    remarks: string
    
}

export class ReissueRequestDecision{
    @ApiPropertyOptional()
    remarks: string
}
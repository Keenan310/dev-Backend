import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BkashRefundPayment{
    @ApiProperty({default: "TRTYUY"})
    @IsString()
    @IsNotEmpty()
    paymentId : number

    @ApiProperty({default: "BDYUIYG"})
    @IsString()
    @IsNotEmpty()
    transactionId : number

    @ApiProperty({default: "100"})
    @IsNumber()
    @IsNotEmpty()
    amount : number
}

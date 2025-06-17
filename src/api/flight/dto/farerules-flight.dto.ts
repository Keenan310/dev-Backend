import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class FareRulesDto{

    @ApiProperty({default: "Sabre"})
    @IsString()
    @IsNotEmpty()
    System: string;
    
    @ApiProperty({default:"2024-01-10"})
    @IsString()
    @IsNotEmpty()
    DepDate: string;
  
    @ApiProperty({default:"DAC"})
    @IsString()
    @IsNotEmpty()
    Origin: string;
  
    @ApiProperty({default:"DXB"})
    @IsString()
    @IsNotEmpty()
    Destination: string;
  
    @ApiProperty({default:"GF"})
    @IsString()
    @IsNotEmpty()
    Carrier: string;
  
    @ApiProperty({default:"WERTYUI"})
    @IsString()
    @IsNotEmpty()
    FareBasisCode: string;
  
  }
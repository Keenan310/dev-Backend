import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class GetFare{

    @ApiProperty({default: "YTIDFUPOP"})
    @IsString()
    @IsNotEmpty()
    token: string;
    
    @ApiProperty({default:"YTDFITYDFUG"})
    @IsString()
    @IsNotEmpty()
    key: string;
  
  }
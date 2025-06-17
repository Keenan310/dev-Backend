import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEmail, IsOptional, IsString, ValidateNested } from "class-validator";

class ContactInfoModel {
    @ApiProperty({default: "user@example.com"})
    @IsEmail()
    email: string;
  
    @ApiProperty({default: "08801685370455"})
    @IsString()
    phone: string;
  }
  
  class PaxModel {
    @ApiProperty({default: "KAYES FAHIM"})
    @IsString()
    givenname: string;
  
    @ApiProperty({default: "FUAD"})
    @IsString()
    surname: string;
  
    @ApiProperty({default: "Male"})
    @IsString()
    gender: string;
  
    @ApiProperty({default: "2011-01-01"})
    dob: Date;
  
    @ApiProperty({default: "A20932903"})
    @IsString()
    document: string;
  
    @ApiProperty({default: "2032-01-01"})
    expiredate: Date;
  
    @ApiProperty({default: "BD"})
    @IsString()
    nationality: string;
  }
  
  
  class PassengerInfoModel {
    @ApiProperty({ type: [PaxModel] })
    @ArrayMinSize(1)
    @ArrayMaxSize(9)
    @IsArray()
    adult: PaxModel[];
  
    @ApiProperty({default:"{}"})
    @IsOptional()
    @ArrayMinSize(1)
    @ArrayMaxSize(8)
    child: [];
  
    @ApiProperty({default:"{}"})
    @ArrayMinSize(1)
    @ArrayMaxSize(4)
    @IsOptional()
    infant: [];
  }
  
export class AirBookingModel {

  
    @ApiProperty()
    @ValidateNested()
    ContactInfo: ContactInfoModel;
  
    @ApiProperty()
    PassengerInfo: PassengerInfoModel;
  
    @ApiProperty()
    FlightInfo: any;
  }
import { ApiProperty } from "@nestjs/swagger";

export class CreatePartialpaymentDto {
    @ApiProperty()
    dueAt: string;
}

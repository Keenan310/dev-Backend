import { PartialType } from '@nestjs/swagger';
import { CreatePartialpaymentDto } from './create-partialpayment.dto';

export class UpdatePartialpaymentDto extends PartialType(CreatePartialpaymentDto) {}

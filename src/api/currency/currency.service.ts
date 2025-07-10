import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { CurrencyConverter } from './entities/currency.entity';
import { AuthService } from '../auth/auth.service';
import { AdminModel } from '../admin/admin.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CurrencyService {
  constructor(
      @InjectRepository(CurrencyConverter)
      private readonly currencyConverterRepository: Repository<CurrencyConverter>,
      private authService: AuthService
    ) {}
  async create(header : any, createCurrencyDto: CreateCurrencyDto) {
    // const verifyAdminId = await this.authService.verifyAdminToken(header);
    
    // if(!verifyAdminId){
    //     throw new UnauthorizedException();
    // }

    return this.currencyConverterRepository.save(createCurrencyDto);
  }

  async findAll(header : any,) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);
    
    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    return this.currencyConverterRepository.find();

  }

  async update(header : any, id: number, updateCurrencyDto: UpdateCurrencyDto) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);
    
    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    return await this.currencyConverterRepository.update(id, updateCurrencyDto);
  }

  async remove(header : any, id: number) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);
    
    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    return await this.currencyConverterRepository.delete(id);
  }
}

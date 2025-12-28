import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirlineDiscount, AirlineDiscountForAgent, AirlinesModel, AirlinesUpdateModel } from './airlines.model';
import { AuthService } from '../auth/auth.service';
import { CreateAirlineDiscountDto, UpdateAirlineDiscountDto, UpdateAirlineDiscountForAgentDto } from './airlines.dto';

@Injectable()
export class AirlinesService {
  constructor(
    @InjectRepository(AirlinesModel)
    private readonly airlinesRepository: Repository<AirlinesModel>,
    @InjectRepository(AirlineDiscount)
    private readonly airlineDiscountRepository: Repository<AirlineDiscount>,
    @InjectRepository(AirlineDiscountForAgent)
    private readonly airlineDiscountForAgentRepository: Repository<AirlineDiscountForAgent>,
    private readonly authService: AuthService
  ) {}

  async createAirlineDiscountMain(header: any, createAirlineDiscountDto : CreateAirlineDiscountDto){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const discount = this.airlineDiscountRepository.create(createAirlineDiscountDto);
    return this.airlineDiscountRepository.save(discount);
  }

  async viewAirlineDiscountMain(header: any, currency: string){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    if (currency && currency.trim() !== '') {
        currency = currency.toUpperCase();
        // Return filtered by currency
        return await this.airlineDiscountRepository.find({ where: { currency } });
    } else {
        // Return all if no currency provided
        return await this.airlineDiscountRepository.find();
    }
  }

  async updateAirlineDiscountMain(header: any, id: number, updateAirlineDiscountDto: UpdateAirlineDiscountDto){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const data = await this.airlineDiscountRepository.findOneBy({ id: id });
    if(!data){
      throw new NotFoundException("Not found");
    }
    return this.airlineDiscountRepository.update(id, updateAirlineDiscountDto);
  }

  async deleteAirlineDiscountMain(header: any, id: number) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const data = await this.airlineDiscountRepository.findOneBy({ id: id });
    if(!data){
      throw new NotFoundException("Not found");
    }
    return await this.airlineDiscountRepository.delete(data.id);
  }

  async createAirlineDiscountForAgent(header: any, createAirlineDiscountDto : CreateAirlineDiscountDto){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const discount = this.airlineDiscountForAgentRepository.create(createAirlineDiscountDto);
    return this.airlineDiscountForAgentRepository.save(discount);
  }

  async viewAirlineDiscountForAgent(header: any, agentId: string){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    return await this.airlineDiscountForAgentRepository.find({ where: { agentId } });
  }

  async updateAirlineDiscountForAgent(header: any, id: number, updateAirlineDiscountForAgentDto: UpdateAirlineDiscountForAgentDto){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const data = await this.airlineDiscountForAgentRepository.findOneBy({ id: id });
    if(!data){
      throw new NotFoundException("Not found");
    }
    return this.airlineDiscountForAgentRepository.update(id, updateAirlineDiscountForAgentDto);
  }

  async deleteAirlineDiscountForAgent(header: any, id: number) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const data = await this.airlineDiscountForAgentRepository.findOneBy({ id: id });
    if(!data){
      throw new NotFoundException("Not found");
    }
    return await this.airlineDiscountForAgentRepository.delete(data.id);
  }

  async getAirlines(code: string) {
    const airlinesData = await this.airlinesRepository.findOne({
      select:['iata','marketing_name', 'soto', 'soti', 'sito', 'domestic', 'addAmount', 'isBlocked','issuePermit','instantPayment','bookable'],
      where: { iata: code }
    });

    if(!airlinesData){
      return '';
    }

    return airlinesData;
  }

  async getAirlinesName(code: string) {
    const airlinesData = await this.airlinesRepository.findOne({
      select:['iata','marketing_name'],
      where: { iata: code }
    });

    if(!airlinesData){
      return '';
    }

    return airlinesData.marketing_name;
  }

  async update(header: any, id: number, updateAirlineDto: AirlinesUpdateModel) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const airlinesData = await this.airlinesRepository.findOne({where: { id: id }});

    if(!airlinesData){
      throw new NotFoundException("Not found");
    }

    return await this.airlinesRepository.update(airlinesData.id, updateAirlineDto);
    
  }

}

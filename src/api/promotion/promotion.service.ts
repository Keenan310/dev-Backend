import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PromotionModel } from './promotion.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class PromotionService {

  constructor(
    @InjectRepository(PromotionModel)
    private readonly promotionRepository: Repository<PromotionModel>,
    private readonly authService: AuthService
  ) {}
  

  async findAllAgent(header: any) {
    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }
    return await this.promotionRepository.find()
  }

  async findAllAdmin(header: any) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    
    return await this.promotionRepository.find()
  }

  async remove(header: any, id: number) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const data = await this.promotionRepository.findOne({
      where: { id: id }
    });

    if(!data){
      throw new NotFoundException();
    }

    return this.promotionRepository.delete(data.id);
  }

}

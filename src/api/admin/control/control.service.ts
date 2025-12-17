import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ControlModel } from './entities/control.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/api/auth/auth.service';

@Injectable()
export class ControlService {

  constructor(
    @InjectRepository(ControlModel)
    private readonly controlRepository: Repository <ControlModel>,
    private readonly authService : AuthService,
  ){}

  async findOne(header: any) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    return await this.controlRepository.findOne({where: {id: 1}});
  }

  async update(header: any, status: string) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    
    const control = await this.controlRepository.findOne({where: {id: 1}});
    if(!control){
      throw new NotFoundException(" Data not found");
    }

    control.status = status;
    return await this.controlRepository.update(1, control);
  }

}

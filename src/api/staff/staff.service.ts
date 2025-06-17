import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { StaffModel, StaffModelUpdate, StaffModelUpdateByAgent } from './staff.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentModel } from '../agent/agent.model';
import { HttpStatusCode } from 'axios';
import { AuthUtils } from '../auth/auth.utils';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(StaffModel)
    private readonly staffRepository: Repository<StaffModel>,
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    private readonly authService: AuthService,
    private readonly authUtils: AuthUtils
  ) {}
  async create(header: any, createStaffDto: StaffModel) {
    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const staff = await this.staffRepository.find({
      where: [
        { email: createStaffDto.email },
        { phone: createStaffDto.phone },
      ],
    });

    if(staff.length > 0){
      throw new HttpException("Staff Already Exist", HttpStatusCode.Conflict);
    }

    const agentdata = await this.agentRepository.find({
      where: [
        { email: createStaffDto.email },
        { phone: createStaffDto.phone },
      ],
    });

    if(agentdata.length > 0){
      throw new HttpException("Staff Info Already Exist as Agent", HttpStatusCode.Conflict);
    }

    createStaffDto.status = 'active';
    const hashedPassword = await this.authUtils.encrypt(createStaffDto.password);
    createStaffDto.password = hashedPassword;
    createStaffDto.agentId = agent.agentId;

    return await this.staffRepository.save(createStaffDto)
  }

  async findAllByAgentUId(header: any){
    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    return await this.staffRepository.find({where: { agentId: agent.agentId }});;
  }

  async findOne(header: any, staffUId: string) {
    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    return await this.staffRepository.findOne({where: { uid: staffUId }});;
  }

  async update(header: any , staffUId: string, updateStaffDto: StaffModelUpdateByAgent) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){ throw new UnauthorizedException()}

    const staff = await this.staffRepository.findOne({where: { uid: staffUId }});
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }
    updateStaffDto['agentId'] = agent.agentId;

    return await this.staffRepository.update(staff.id, updateStaffDto);
  }

  async myaccount(header: any,  staffUId: string) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){ throw new UnauthorizedException()}

    return await this.staffRepository.findOne({where: { uid: staffUId }});
  }

  async myaccountupdate(header: any, staffUId: string, updateStaffDto: StaffModelUpdate) {
    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){ throw new UnauthorizedException()}
    
    const staff = await this.staffRepository.findOne({where: { uid: staffUId }});
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    return this.staffRepository.update(staff.id, updateStaffDto);
  }

}

import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BankListModel } from './banklist.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { AgentModel } from '../agent/agent.model';
import { HttpStatusCode } from 'axios';

@Injectable()
export class BanklistService {

  constructor(
    @InjectRepository(BankListModel)
    private readonly banklistRepository: Repository<BankListModel>,
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    private readonly authService:AuthService
  ){}

  async createadmin(header: any, createBanklistDto: BankListModel) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const existBank = await this.banklistRepository.findOne({where : 
      {bankname: createBanklistDto.bankname,
      accountnumber: createBanklistDto.accountnumber}
    })

    if(existBank){
      throw new HttpException("Alreday Exists Banklist", HttpStatusCode.Conflict);
    }


    createBanklistDto['agentId'] = 'admin';

    return this.banklistRepository.save(createBanklistDto);
  }

  async findAllBankList(header : any) {
    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    return this.banklistRepository.find({where : {agentId: 'admin'}});
  }

  async findAllByAdmin(header: any) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    return this.banklistRepository.find({where : {agentId: 'admin'}});
  }

  async updateadmin(header: any, uid: string, updateBanklistDto: BankListModel) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const banklist = await this.banklistRepository.findOne({where: { uid: uid }});
    if (!banklist) {
      throw new NotFoundException('Agent not found');
    }

    return this.banklistRepository.update(banklist.id, updateBanklistDto);
  }

  async removeadmin(header: any, uid: string) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const banklist = await this.banklistRepository.findOne({where: { uid: uid }});
    if (!banklist) {
      throw new NotFoundException('Bank Id not found');
    }

    return this.banklistRepository.delete(banklist.id);
  }

  async createagent(agentUId: string, createBanklistDto: BankListModel) {
    const agent = await this.agentRepository.findOne({where: { uid: agentUId }});
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    createBanklistDto['agentId'] = agent.agentId;
    return this.banklistRepository.create(createBanklistDto);
  }

  async findAllByAgent(agentUId: string) {
    const agent = await this.agentRepository.findOne({
      where: { uid: agentUId },
    });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return this.banklistRepository.find({where: { agentId: agent.agentId}});
  }


  async updateagent(uid: string, updateBanklistDto: BankListModel) {
    const banklist = await this.banklistRepository.findOne({where: { uid: uid }});
    if (!banklist) {
      throw new NotFoundException('Agent not found');
    }

    return this.banklistRepository.update(banklist.id, updateBanklistDto);
  }

  async removeagent(uid: string) {
    const banklist = await this.banklistRepository.findOne({where: { uid: uid }});
    if (!banklist) {
      throw new NotFoundException('UId not found');
    }

    return this.banklistRepository.delete(banklist.id);
  }
}

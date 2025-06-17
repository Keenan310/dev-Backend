import { HttpCode, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AgentBalanceUpdate, AgentCreditModel, AgentMarkUpUpdate, AgentModel, AgentModelUpdateAdmin, AgentModelUpdateAgent } from './agent.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dotenv from "dotenv";
import { BookingModel } from '../booking/booking.model';
import { DepositModel } from '../deposit/deposit.model';
import { HttpStatusCode } from 'axios';
import { AuthService } from '../auth/auth.service';
import { AgentLedgerModel } from '../report/report.model';
import { MailService } from 'src/mail/mail.service';
import { AuthUtils } from '../auth/auth.utils';
dotenv.config()

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    @InjectRepository(AgentLedgerModel)
    private readonly agentLedgerRepository: Repository<AgentLedgerModel>,
    @InjectRepository(AgentCreditModel)
    private readonly agentCreditRepository: Repository<AgentCreditModel>,
    @InjectRepository(BookingModel)
    private readonly bookingRepository: Repository<BookingModel>,
    @InjectRepository(DepositModel)
    private readonly depositRepository: Repository<DepositModel>,
    private authService: AuthService,
    private authUtils: AuthUtils,
    private mailService: MailService
  ) {}
  
  async findAllAdmin(header: any, page: number, status: string, filter: string, limit: number) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const skip = (page - 1) * limit;
    const take = limit;

    let queryBuilder = this.agentRepository.createQueryBuilder("agent");

    if (status) {
        queryBuilder = queryBuilder.where("agent.status = :status", { status });
    }

    if (filter) {
        queryBuilder = queryBuilder.andWhere("(agent.agentId LIKE :filter OR agent.name LIKE :filter OR agent.company LIKE :filter OR agent.email LIKE :filter OR agent.phone LIKE :filter)", { filter: `%${filter}%` });
    }

    const totaldata = await queryBuilder.getCount();

    const agents = await queryBuilder
        .orderBy("agent.id", "DESC")
        .skip(skip)
        .take(take)
        .getMany();

    const agentsData = {
      limit: Number(limit),
      page: Number(page),
      totalpage: Math.ceil(totaldata / limit),
      totaldata: totaldata,
      data: agents
    }

    return agentsData;
  }

  async findAllStatus(headers: any, status: string){
    const verifyAdminId = await this.authService.verifyAdminToken(headers);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    return await this.agentRepository.find({where: {status: status}});
    
  }

  async findOne(headers: any, uid: string) {
    const verifyAdminId = await this.authService.verifyAdminToken(headers);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    const agent = await this.agentRepository.findOne({
      where: { uid: uid },
    });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    return agent;
  }

  async update(header: any, uid: string, updateAgentDto: AgentModelUpdateAdmin) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    
    const agent = await this.agentRepository.findOne({
      where: { uid: uid },
    });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return this.agentRepository.update(agent.id, updateAgentDto);
  }

  async updateAgentStatus(header: any, uid: string, status: string) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    
    const agent = await this.agentRepository.findOne({where: { uid: uid }});
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    if(agent.status === status || agent.status === 'pending' || agent.status === 'deactive'){
      agent['status'] = status;
      const agentresponse = await this.agentRepository.update(agent.id, agent);
      if(agentresponse.affected === 1){
        await this.mailService.signUpDecisionMail(agent);
        return { message: 'Agent '+status+' Successfully.'};
      }else{
        return { message: 'Something error'};
      }
    }
  }

  async resetpasswordadmin(header: any, uid: string){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    
    const agent = await this.agentRepository.findOne({where: { uid: uid }});
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const generatePassword = await this.authUtils.generateRandomPassword()
    const hashedPassword = await this.authUtils.encrypt(generatePassword);

    agent.password = hashedPassword;

    const update = await this.agentRepository.update(agent.id, agent);
    if(update.affected === 1){
      await this.mailService.resetPasswordMail(agent, generatePassword);
      return 'Password rest successfully. New password send to agent email';
    }else{
      throw new HttpException('error Occure' , HttpStatusCode.BadRequest);
    }



  }

  async remove(header: any, uid: string) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const agent = await this.agentRepository.findOne({
      where: { uid: uid },
    });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const booking = await this.bookingRepository.findOne({
      where: { agentId: agent.agentId },
    });

    const deposit = await this.depositRepository.findOne({
      where: { agentId: agent.agentId },
    });

    if(booking){
      throw new HttpException('Agent has booking or ticket. You cannot delete agent', HttpStatusCode.Forbidden);
    }

    if(deposit){
      throw new HttpException('Agent has deposit. You cannot delete agent', HttpStatusCode.Forbidden);
    }

    return await this.agentRepository.delete(agent.id);
  }

  async myaccountadmin(header: any, uid: string){

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const agent = await this.agentRepository.findOne({where: { uid: uid }});
    
    if (!agent) {throw new NotFoundException('Agent not found')}

    agent['password'] = await this.authUtils.decrypt(agent.password );
    const agentLedger = await this.agentLedgerRepository
    .createQueryBuilder()
    .select('SUM(amount)', 'sum')
    .where('agentId = :agentId', { agentId: agent.agentId })
    .getRawOne();

    agent['balance'] = agentLedger.sum != null ? agentLedger.sum : 0;
    return agent;
  }

  async myaccount(header: any){

    const verifyAgent = await this.authService.verifyAgentToken(header);

    if(!verifyAgent){
        throw new UnauthorizedException();
    }

    const agent = await this.agentRepository.findOne({where: { uid: verifyAgent.uid }});
    
    if (!agent) {throw new NotFoundException('Agent not found')}

    delete agent.password;
    const agentLedger = await this.agentLedgerRepository
    .createQueryBuilder()
    .select('SUM(amount)', 'sum')
    .where('agentId = :agentId', { agentId: agent.agentId })
    .getRawOne();

    agent['balance'] = agentLedger.sum != null ? agentLedger.sum : 0;
    return agent;
  }

  async agentmyaccountadmin(header: any, agentUId: string,  updateMyAgentDto: AgentModelUpdateAdmin) {

    const verifyAdmin= await this.authService.verifyAdminToken(header);
    if(!verifyAdmin){
        throw new UnauthorizedException();
    }

    const agent = await this.agentRepository.findOne({where: { uid: agentUId }});
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return this.agentRepository.update(agent.id, updateMyAgentDto);
  }

  async updateagentmyaccount(header: string, updateMyAgentDto: AgentModelUpdateAgent) {

    const verifyAgent = await this.authService.verifyAgentToken(header);

    if(!verifyAgent){
        throw new UnauthorizedException();
    }

    const agent = await this.agentRepository.findOne({where: { uid: verifyAgent.uid }});
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    if(updateMyAgentDto?.password){
      const hashedPassword = await this.authUtils.encrypt(updateMyAgentDto.password);
      agent.password = hashedPassword;
    }

    if(updateMyAgentDto?.markuptype){
      agent.clientmarkuptype =  updateMyAgentDto.markuptype;
      agent.clientmarkup =  updateMyAgentDto.markup;
    }

    return this.agentRepository.update(agent.id, updateMyAgentDto);
  }

  async updateagentmarkup(header: any, updateMyAgentMarkUpDto: AgentMarkUpUpdate) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    agent['clientmarkup'] =  updateMyAgentMarkUpDto.markup;
    agent['clientmarkuptype'] =  updateMyAgentMarkUpDto.markuptype;

    return this.agentRepository.update(agent.id, agent);
  }

  async getcredit(uid: string){
    const agent = await this.agentRepository.findOne({where: { uid: uid }});
    
    if (!agent) {throw new NotFoundException('Agent not found')}

    const agentCredit = await this.agentCreditRepository.find({where: { agentId: agent.agentId }, order: {id : 'DESC'}})

    return agentCredit;
  }

  async addcredit(header: any, uid: string, creditModel: AgentCreditModel){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    
    const agent = await this.agentRepository.findOne({where: { uid: uid }});
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const previousCredit = agent.credit;
    const newCredit = previousCredit + Number(creditModel.amount);

    agent['credit'] = newCredit;

    const createModels = new AgentCreditModel();
    createModels.agentId = agent.agentId;
    createModels.amount = newCredit;
    createModels.description = creditModel.description;
    createModels.credited_by = verifyAdminId.firstname + verifyAdminId.lastname;

    await this.agentCreditRepository.save(createModels);
    return this.agentRepository.update(agent.id, agent);
  }

  async addBalance(header : any, uid: string, updateAgentBalanceDto: AgentBalanceUpdate) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
      throw new UnauthorizedException();
    }

    const agent = await this.agentRepository.findOne({where: { uid: uid }});
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const details = updateAgentBalanceDto.amount + ' BDT By '+ verifyAdminId.firstname;

    const AgentLedgerData = {
      agentId: agent.agentId,
      trxtype: updateAgentBalanceDto.trxtype,
      amount: updateAgentBalanceDto.amount,
      refId: updateAgentBalanceDto.refId,
      details: details,
      companyname: agent.company
    }

    return await this.agentLedgerRepository.save(AgentLedgerData);

  }

}

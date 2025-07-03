import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepositBonuseModel, DepositModel, DepositModelUpdateStatus } from './deposit.model';
import { Repository } from 'typeorm';
import { AgentModel } from '../agent/agent.model';
import { AuthService } from '../auth/auth.service';
import { AgentLedgerModel } from '../report/report.model';
import { HttpStatusCode } from 'axios';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class DepositService {
  constructor(
    @InjectRepository(DepositModel)
    private readonly depositRepository: Repository<DepositModel>,
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    @InjectRepository(AgentLedgerModel)
    private readonly agentLedgerRepository: Repository<AgentLedgerModel>,
    private readonly authService: AuthService,
    private mailService : MailService
  ) {}

  async findAllAdmin(header: any, page: number, status: string, filter: string, limit: number) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    
    const skip = (page - 1) * limit;
    const take = limit;

    let queryBuilder = this.depositRepository.createQueryBuilder("deposit");

    if (status) {
        queryBuilder = queryBuilder.where("deposit.status = :status", { status });
    }

    if (filter) {
        queryBuilder = queryBuilder.andWhere("(deposit.agentId LIKE :filter OR deposit.depositId LIKE :filter OR deposit.companyname LIKE :filter OR deposit.ref LIKE :filter OR deposit.trxId LIKE :filter OR deposit.paymentway LIKE :filter)", { filter: `%${filter}%` });
    }

    const totaldata = await queryBuilder.getCount();

    const deposits = await queryBuilder
        .orderBy("deposit.id", "DESC")
        .skip(skip)
        .take(take)
        .getMany();


    const depositsData = {
      limit: Number(limit),
      page: Number(page),
      totalpage: Math.ceil(totaldata / limit),
      totaldata: totaldata,
      data: deposits
    }

    return depositsData;
  }

  async findAllAgent(header: any, page: number, status: string, filter: string, limit: number) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const skip = (page - 1) * limit;
    const take = limit;

    let queryBuilder = this.depositRepository.createQueryBuilder("deposit");

    if (status) {
        queryBuilder = queryBuilder.where("deposit.status = :status", { status });
    }

    if (filter) {
        queryBuilder = queryBuilder.andWhere("(deposit.depositId LIKE :filter OR deposit.ref LIKE :filter OR deposit.trxId LIKE :filter OR deposit.paymentway LIKE :filter)", { filter: `%${filter}%` });
    }

    const agentId = agent.agentId;
    queryBuilder.andWhere("deposit.agentId = :agentId", { agentId });

    const totaldata = await queryBuilder.getCount();

    const deposits = await queryBuilder
        .orderBy("deposit.id", "DESC")
        .skip(skip)
        .take(take)
        .getMany();


    const depositsData = {
      limit: Number(limit),
      page: Number(page),
      totalpage: Math.ceil(totaldata / limit),
      totaldata: totaldata,
      data: deposits
    }

    return depositsData;
  }

  async update(header : any, uid: string, updateDepositDto: DepositModelUpdateStatus) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
      throw new UnauthorizedException();
    }

    const deposit = await this.depositRepository.findOne({
      where: { uid: uid },
    });
    if (!deposit) {
      throw new NotFoundException('UId not found');
    }

    return this.depositRepository.update(deposit.id, updateDepositDto);

  }

  async updatestatus(header : any, uid: string, updateDepositDto: DepositModelUpdateStatus) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
      throw new UnauthorizedException();
    }

    const deposit = await this.depositRepository.findOne({where: { uid: uid }});
    if (!deposit) {
      throw new NotFoundException('Deposit not found');
    }

    if(deposit.status == 'approved' || deposit.status == 'rejected'){
      throw new HttpException(`Deposit already ${deposit.status}`, HttpStatusCode.Locked);
    }

    if(updateDepositDto.status === 'approved') {
      deposit.status = 'approved';

      const details = deposit.amount + ' AED Deposite By '+ deposit.sender;

      const AgentLedgerData = {
        agentId: deposit.agentId,
        trxtype: 'deposit',
        amount: deposit.amount,
        refId: deposit.depositId,
        details: details,
        companyname: deposit.companyname
      }

      const agentleader = await this.agentLedgerRepository.findOne(
        {where: 
          { refId: deposit.depositId ,
            trxtype: 'deposit'
          }
        });
      if (agentleader) {
        throw new HttpException('Deposit Info already exist in ledger', HttpStatusCode.AlreadyReported);
      }

      await this.agentLedgerRepository.save(AgentLedgerData);
      await this.mailService.depositRequestApproved(deposit);

    }else if(updateDepositDto.status === 'rejected'){
      deposit.status = 'rejected';
      deposit.remarks = updateDepositDto.remarks;
    }

    return this.depositRepository.update(deposit.id, deposit);

  }

  async addDepositBonus(header : any, agentUId: string, depositBonuseModel: DepositBonuseModel) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
      throw new UnauthorizedException();
    }

    const agent = await this.agentRepository.findOne({where: { uid: agentUId }});
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const details = depositBonuseModel.bonus + ' AED Deposit Bonus By '+ verifyAdminId.firstname;
    const AgentLedgerData = {
      agentId: agent.agentId,
      trxtype: 'bonus',
      amount: depositBonuseModel.bonus,
      refId: depositBonuseModel.refId,
      details: details,
      companyname: agent.company
    }

    const addAgentLedger = await this.agentLedgerRepository.save(AgentLedgerData);
    await this.mailService.depositBonus(addAgentLedger);
    return addAgentLedger;

  }

  async findAllAgentByAdmin(header: any, agentUId: string, page: number, status: string, filter: string, limit: number) {

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const skip = (page - 1) * limit;
    const take = limit;

    let queryBuilder = this.depositRepository.createQueryBuilder("deposit");

    if (status) {
        queryBuilder = queryBuilder.where("deposit.status = :status", { status });
    }

    if (filter) {
        queryBuilder = queryBuilder.andWhere("(deposit.depositId LIKE :filter OR deposit.ref LIKE :filter OR deposit.trxId LIKE :filter OR deposit.paymentway LIKE :filter)", { filter: `%${filter}%` });
    }

    const agentId = agent.agentId;
    queryBuilder.andWhere("deposit.agentId = :agentId", { agentId });

    const totaldata = await queryBuilder.getCount();

    const deposits = await queryBuilder
        .orderBy("deposit.id", "DESC")
        .skip(skip)
        .take(take)
        .getMany();


    const depositsData = {
      limit: Number(limit),
      page: Number(page),
      totalpage: Math.ceil(totaldata / limit),
      totaldata: totaldata,
      data: deposits
    }

    return depositsData;
  }


}

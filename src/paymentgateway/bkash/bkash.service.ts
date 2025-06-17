import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import * as dotenv from "dotenv";
import { createPayment, executePayment, queryPayment, searchTransaction, refundTransaction } from 'bkash-payment';
import { InjectRepository } from '@nestjs/typeorm';
import { AgentModel } from 'src/api/agent/agent.model';
import { Repository } from 'typeorm';
import { DepositModel } from 'src/api/deposit/deposit.model';
import { AgentLedgerModel } from 'src/api/report/report.model';
import { HttpStatusCode } from 'axios';
import { MailService } from 'src/mail/mail.service';
dotenv.config();

@Injectable()
export class BkashService {
  private bkashConfig: any;
  constructor(
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    @InjectRepository(DepositModel)
    private readonly depositRepository: Repository<DepositModel>,
    @InjectRepository(AgentLedgerModel)
    private readonly agentLedgerRepository: Repository<AgentLedgerModel>,
    private readonly mailService : MailService,
  ){
     this.bkashConfig = {
      base_url : process.env.BKASH_BASE_URL,
      username: process.env.BKASH_USERNAME,
      password: process.env.BAKSH_PASSWORD,
      app_key: process.env.BKASH_APP_KEY,
      app_secret: process.env.BKASH_APP_SECRET
     }
  }

  async createPayment(agentUId : string , amount: number) {

    const agent = await this.agentRepository.findOne({where: {uid: agentUId}});
    if(!agent){
      throw new NotFoundException('Agent not found');
    }
  
    try {
      const now = new Date();
      const unixTimestampSeconds = Math.floor(now.getTime() / 1000);
      const orderID : string = 'MFSB'+unixTimestampSeconds;
      const paymentDetails = {
        amount: amount || 10,
        callbackURL : process.env.BKASH_CALLBACKURL,
        orderID : orderID || 'Order_101',
        reference : agent.uid || 'x'
      }

      const result = await createPayment(this.bkashConfig, paymentDetails);
      return result;
    } catch (e) {
      console.log(e)
    }
  }

  async executePayment(paymentID: string, status : string, res){
    try {
      if(status === 'success'){
        let result: any;
        result =  await executePayment(this.bkashConfig, paymentID);

        if(result?.transactionStatus === 'Completed' && result?.statusMessage === 'Successful'){
          const agent =  await this.agentRepository.findOne({where : {uid: result.payerReference}});
          if(!agent){
            throw new NotFoundException('Invalid agentUId');
          }

          const deposit = await this.depositRepository.find({
            order: { id: 'DESC' }, take : 1,
          });
          
          let depositId: string;
          if(deposit.length === 1){
            let old_deposit_id = (deposit[0].depositId).replace("POD",'');
            depositId = "POD" + (parseInt(old_deposit_id) + 1);
          }else{
            depositId = 'POD1000';
          }

          const depositModel =  new DepositModel;
            depositModel.depositId= depositId;
            depositModel.agentId= agent.agentId;
            depositModel.sender = result?.customerMsisdn || '';
            depositModel.receiver = "Bkash";
            depositModel.paymentway = "MFS";
            depositModel.paymentId = result.paymentID,
            depositModel.trxId = result.trxID,
            depositModel.ref= result.merchantInvoiceNumber;
            depositModel.status= "approved";
            depositModel.amount = result.amount;
            depositModel.attachment= '' ;
            depositModel.companyname= agent.company;
        
          const depositResult = await this.depositRepository.save(depositModel);

          const details = result.amount + ' BDT Deposit By '+ result.sender + '. Through Bkash- '+ result?.customerMsisdn;

        const actualAmount = Number(result.amount) - (Number(result.amount) * 1.4/100);
        const AgentLedgerData = {
          agentId: depositResult.agentId,
          trxtype: 'deposit',
          amount: actualAmount,
          refId: depositResult.depositId,
          details: details,
          companyname: depositResult.companyname
        }

        const agentleader = await this.agentLedgerRepository.findOne(
          {where: 
            { refId: depositId ,
              trxtype: 'deposit'
            }
          });
        if (agentleader) {
          throw new HttpException('Deposit Info already exist in ledger', HttpStatusCode.AlreadyReported);
        }

        await this.agentLedgerRepository.save(AgentLedgerData);
        await this.mailService.depositRequestDecision(depositResult);
        return res.redirect('https://b2b.etripzone.com/payment/success');
        }else{
          const url = 'https://b2b.etripzone.com/payment/'+result?.statusMessage;
          return res.redirect(url);
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  async refundPayment(depositUId: string) {

    const deposit = await this.depositRepository.findOne({where: {uid: depositUId}});
    if(!deposit){
      throw new NotFoundException('Agent not found');
    }

    try {
      const refundDetails = {
        paymentID: deposit.paymentId,
        trxID: deposit.trxId,
        amount: deposit.amount,
      }
      const result = await refundTransaction(this.bkashConfig, refundDetails)
      return result;
    } catch (e) {
      console.log(e)
    }
  }

  async searchPayment(trxID : string) {
    try {
      const result = await searchTransaction(this.bkashConfig, trxID)
      return result
    } catch (e) {
      console.log(e)
    }
  }

  async queryPayment(paymentID : string) {
    try {
      const result = await queryPayment(this.bkashConfig, paymentID)
      return result;
    } catch (e) {
      console.log(e)
    }
  }
}

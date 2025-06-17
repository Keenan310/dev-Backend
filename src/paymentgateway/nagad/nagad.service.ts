import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgentModel } from 'src/api/agent/agent.model';
import { DepositModel } from 'src/api/deposit/deposit.model';
import { AgentLedgerModel } from 'src/api/report/report.model';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import axios from 'axios';
import fetch from "node-fetch";
import { decryptSensitiveData, encryptSensitiveData, generateDigitalSignature, isVerifiedDigitalSignature } from './nagad.utils';
import { format } from 'date-fns';


@Injectable()
export class NagadService {

  constructor(
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    @InjectRepository(DepositModel)
    private readonly depositRepository: Repository<DepositModel>,
    @InjectRepository(AgentLedgerModel)
    private readonly agentLedgerRepository: Repository<AgentLedgerModel>,
    private readonly mailService : MailService,
  ){}

  async createPayment(agentUId : string, amount : number){

    const agent = await this.agentRepository.findOne({where: {uid: agentUId}});
    if(!agent){
      throw new NotFoundException('Agent not found');
    }

    const api_public_key = `-----BEGIN PUBLIC KEY-----\n${process.env.NAGAD_PUBLIC_KEY}\n-----END PUBLIC KEY-----`;
    const api_private_key = `-----BEGIN PRIVATE KEY-----\n${process.env.NAGAD_PRIVATE_KEY}\n-----END PRIVATE KEY-----`;

    
    const MerchantID = process.env.NAGAD_MERCHANT_ID;
    const OrderString = `${Date.now()}${Math.floor(Math.random() * 99 + 1)}`;
    const OrderId = `${agent.agentId}X${OrderString}`.substring(0, 20);
    const random = crypto.randomBytes(20).toString("hex");
    
    const PostURL = process.env.NAGAD_BASE_URL+`api/dfs/check-out/initialize/${MerchantID}/${OrderId}`;
    const merchantCallbackURL = "http://localhost:8080/pgw/nagad";

    const SensitiveData = {
      merchantId: MerchantID,
      datetime: format(new Date(), "yyyyMMddHHmmSS"),
      orderId: OrderId,
      challenge: random
    };
    

    const PostData = {
      dateTime: format(new Date(), "yyyyMMddHHmmSS"),
      sensitiveData: encryptSensitiveData({
        sensitive_data: JSON.stringify(SensitiveData),
        public_key: api_public_key,
      }),
      signature: generateDigitalSignature({
        sensitive_data: JSON.stringify(SensitiveData),
        private_key: api_private_key,
      }),
    };

    const checkout_initialize = await fetch(PostURL,
      {
        method: "POST",
        headers: {
          "X-KM-IP-V4": "127.0.0.1",
          "X-KM-Client-Type": "PC_WEB",
          "X-KM-Api-Version": "v-0.2.0",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(PostData),
      }
    );
    const checkout_init_res = await checkout_initialize.json();
  
    console.log(checkout_init_res);
  
    const decrypted_checkout_init_res = JSON.parse(
      decryptSensitiveData({
        sensitive_data: checkout_init_res.sensitiveData,
        private_key: api_private_key,
      })
    );
  
    console.log(decrypted_checkout_init_res);
  
    const isCheckoutInitVerified = isVerifiedDigitalSignature({
      sensitive_data: JSON.stringify(decrypted_checkout_init_res),
      signature: checkout_init_res.signature,
      public_key: api_public_key,
    });
  
    console.log(isCheckoutInitVerified);
  }

  async executePayment(){

  }

  async refundPayment(){

  }

  async searchPayment(){

  }
}

import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { extname } from 'path';
import * as AWS from 'aws-sdk';
import * as bcrypt from 'bcrypt';
import {DoSpacesServiceLib} from './upload.provider.service';
import { v4 as uuidv4 } from 'uuid';
import { AgentModel } from '../agent/agent.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { BookingModel } from '../booking/booking.model';
import { ReissueModel } from '../reissue/reissue.model';
import { PromotionModel } from '../promotion/promotion.model';
import { DepositModel } from '../deposit/deposit.model';
import * as dotenv from "dotenv"
import { PassengerModel } from '../passenger/passenger.model';
import { MailService } from 'src/mail/mail.service';
import { StaffModel } from '../staff/staff.model';
import { AdminModel } from '../admin/admin.model';
import { AuthUtils } from '../auth/auth.utils';
dotenv.config();

@Injectable()
export class UploadService {
  constructor(
    @Inject(DoSpacesServiceLib)
    private readonly s3: AWS.S3,
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    @InjectRepository(PassengerModel)
    private readonly passengerRepository: Repository<PassengerModel>,
    @InjectRepository(AdminModel)
    private readonly adminRepository: Repository<AdminModel>,
    @InjectRepository(BookingModel)
    private readonly bookingRepository: Repository<BookingModel>,
    @InjectRepository(StaffModel)
    private readonly staffRepository: Repository<StaffModel>,
    @InjectRepository(PromotionModel)
    private readonly promotionRepository: Repository<PromotionModel>,
    @InjectRepository(ReissueModel)
    private readonly reissueRepository: Repository<ReissueModel>,
    @InjectRepository(DepositModel)
    private readonly depositRepository: Repository<DepositModel>,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly authUtils: AuthUtils
  ) {}

  async signup(agentDto : AgentModel, files): Promise<any> {
    
      const existAdmin = await this.adminRepository.findOne({where: { email: agentDto.email }});
      if (existAdmin) {
        throw new HttpException('Email already exist as Admin', HttpStatus.CONFLICT);
      }
      const existStaff = await this.staffRepository.findOne({where: { email: agentDto.email }});
      if (existStaff) {
        throw new HttpException('Email already exist as Staff', HttpStatus.CONFLICT);
      }
  
      const existingAgent = await this.agentRepository.findOne({where: [{ email: agentDto.email }, { phone: agentDto.phone }]});
  
      if (existingAgent?.email === agentDto.email) {
        throw new HttpException('Email already exist', HttpStatus.CONFLICT);
      }else if(existingAgent?.phone === agentDto.phone){
        throw new HttpException('Phone already exist', HttpStatus.CONFLICT);
      }
      
      const agent = await this.agentRepository.find({order: { id: 'DESC' }, take : 1});
  
      let agentId: string;
      if(agent.length === 1){
        let old_agent_id = (agent[0].agentId).replace("KTA",'');
        agentId = "KTA" + (parseInt(old_agent_id) + 1);
      }else{
        agentId = 'KTAA1000';
      }

      const hashedPassword = await bcrypt.hash(agentDto.password, 9);
      agentDto.password = hashedPassword;
      agentDto.agentId = agentId;
      agentDto.status = 'pending';

      agentDto.ip = await this.authUtils.getPublicIp() || 'N/F';
      agentDto.searchlimit = 100;

      try {
        const uploads = [];
      
        if (files?.nid && files?.nid[0]) {
          const nidFileType = files.nid[0].originalname.split('.').pop();
          const nidKey = `B2B/${agentId}/Docs/nid.${nidFileType}`;
          const nidParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: nidKey,
            Body: files.nid[0].buffer,
            ACL: 'public-read',
            ContentType: files.nid[0].mimetype
          };
          uploads.push(this.s3.upload(nidParams).promise().then(() => `${process.env.CDN_SPACES}/${nidKey}`));
        }
      
        if (files?.tl && files?.tl[0]) {
          const tlFileType = files.tl[0].originalname.split('.').pop();
          const tlKey = `B2B/${agentId}/Docs/tl.${tlFileType}`;
          const tlParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: tlKey,
            Body: files.tl[0].buffer,
            ACL: 'public-read',
            ContentType: files.tl[0].mimetype
          };
          uploads.push(this.s3.upload(tlParams).promise().then(() => `${process.env.CDN_SPACES}/${tlKey}`));
        }
      
        const [nidUrl, tlUrl] = await Promise.all(uploads);
      
        if (nidUrl) agentDto.nid = nidUrl;
        if (tlUrl) agentDto.tradelicense = tlUrl;
      
        const responseData = await this.agentRepository.save(agentDto);
        await this.mailService.signUpMail(agentDto);
        return responseData;
      } catch (err) {
        console.log(err);
        throw new Error('An error occurred during the operation.');
      }
      
   
  }

  async uploadAgentLogo(header: any, file, res){

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    if(!file){
      throw new NotFoundException('Please select a file to upload');
    }

    const agentId = agent.agentId;
    const filetype = (file.originalname).split('.')[1];
    const keyvalue = agentId + '/companylogo' + '.' + filetype;

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: 'B2B/' + keyvalue,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype
    };

    this.s3.putObject(params, (err, data) => {
      if (err) {  
        res.status(500).json({ status: 'error', message: 'Something Error In Code'});
      } else {
        const url = process.env.CDN_SPACES+'/B2B/' + keyvalue;

        agent['logo']= url;
        this.agentRepository.update(agent.id, agent);
        res.status(201).json({ status: 'success', message: 'Logo uploaded successfully', fileurl: url });
      }
    });

  }

  async uploadAgentTradeLicense(agentUId: string, file, res){

    if(!file){
      throw new NotFoundException('Please select a file to upload');
    }

    const agent =  await this.agentRepository.findOne({where : {uid: agentUId}});
    const agentId = agent.agentId;
    const filetype = (file.originalname).split('.')[1];
    const keyvalue = agentId + '/tradelicense' + '.' + filetype;

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: 'B2B/' + keyvalue,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype
    };

    this.s3.putObject(params, (err, data) => {
      if (err) {  
        res.status(500).json({ status: 'error', message: 'Something Error In Code'});
      } else {
        const url = process.env.CDN_SPACES+'/B2B/' + keyvalue;

        agent['tradelicense']= url;
        this.agentRepository.update(agent.id, agent);
        res.status(201).json({ status: 'success', message: 'Trade License uploaded successfully', fileurl: url });
      }
    });
  }

  async uploadPassengerDocs(docs: string, paxUId: string, file, res){

    if(!file){
      throw new NotFoundException('Please select a file to upload');
    }

    const passenger =  await this.passengerRepository.findOne(
      {where : {uid: paxUId}});

    if(!passenger){
      throw new NotFoundException('Passenger not found');
    }
    
    const filetype = (file.originalname).split('.')[1];

    let keyvalue : string;
    if(docs === 'passport'){
      keyvalue = 'PassengerDocs/'+paxUId + '/passportcopy' + '.' + filetype;
    }else if(docs === 'visa') {
       keyvalue = 'PassengerDocs/'+paxUId + '/visacopy' + '.' + filetype;
    }

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: 'B2B/' + keyvalue,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype
    };

    this.s3.putObject(params, async (err, data) => {
      if (err) {  
        res.status(500).json({ status: 'error', message: 'Something Error In Code'});
      } else {
        const url = process.env.CDN_SPACES+'/B2B/' + keyvalue;

        if(docs === 'visa') {
          passenger['visa'] = url;
        }else if(docs === 'passport'){
          passenger['passport'] = url;
        }
        await this.passengerRepository.update(passenger.id, passenger);
        res.status(201).json({ status: 'success', message: docs.toLocaleUpperCase()+' Copy uploaded successfully', fileurl: url });
      }
    });


  }

  async addDeposit(header: any, amount: number, sender : string, receiver: string, paymentway:string, reference: string, file : any, res){

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    const agentId = agent.agentId;
    const existingTrxId = await this.depositRepository.findOne({where: {ref: reference, agentId: agentId}});

    if (existingTrxId) {
      throw new HttpException('Duplicate Transaction Id', HttpStatus.CONFLICT);
    }

    const allowedFileTypes = ['png', 'jpg', 'jpeg', 'pdf', 'PNG', 'JPG', 'JPEG'];
    const fileType = extname(file.originalname).toLowerCase().slice(1);
    if (!allowedFileTypes.includes(fileType)) {
      throw new HttpException('Invalid file formate', HttpStatus.FORBIDDEN);
    }else if (file.size > process.env.ALLOW_IMAGE_SIZE){
      throw new HttpException('File size exceeds the limit max 2MB', HttpStatus.FORBIDDEN);
    }
    
    const fileName = uuidv4();
    let keyvalue = agentId + '/deposit/' + fileName + '.' + fileType;

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: 'B2B/' + keyvalue,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype
    };

    this.s3.putObject(params, async (err, data) => {
      if (err) {  
        throw new HttpException('Something Error', HttpStatus.BAD_REQUEST);
      } else {
        const url = process.env.CDN_SPACES +'/B2B/' + keyvalue;
        const deposit = await this.depositRepository.find({
          order: { id: 'DESC' }, take : 1,
        });
    
        let depositId: string;
        if(deposit.length === 1){
          let old_deposit_id = (deposit[0].depositId).replace("KTD",'');
          depositId = "KTD" + (parseInt(old_deposit_id) + 1);
        }else{
          depositId = 'KTD1000';
        }

        const depositModel =  new DepositModel;
          depositModel.depositId= depositId;
          depositModel.agentId= agent.agentId;
          depositModel.sender = sender;
          depositModel.receiver = receiver;
          depositModel.paymentway = paymentway;
          depositModel.ref= reference;
          depositModel.status= "pending";
          depositModel.amount = amount;
          depositModel.attachment= url ;
          depositModel.companyname= agent.company;
      
        const depostResult = await this.depositRepository.save(depositModel);
        await this.mailService.depositRequest(depositModel, file);
        res.status(201).json(depostResult);
      }
    });
  }

  async addPromotion(header: any, category: string,  file, res){

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    if(!file){
      throw new NotFoundException('Please select a file to upload');
    }

    const filetype = (file.originalname).split('.')[1];
    const fileName = uuidv4();
    const keyvalue = 'Promotion/'+fileName+'.' + filetype;

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: 'B2B/' + keyvalue,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype
    };

    this.s3.putObject(params, (err, data) => {
      if (err) {  
        res.status(500).json({ status: 'error', message: 'Something Error In Code'});
      } else {
        const url = process.env.CDN_SPACES+'/B2B/' + keyvalue;

        const data = new PromotionModel();
        data.image = url;
        data.category = category;
        data.caption = category;

        this.promotionRepository.save(data);
        res.status(201).json({ status: 'success', message: 'Promotion uploaded successfully', fileurl: url });
      }
    });
  }

  async uploadReissueTicketCopy(header: any, bookingUId: string, file, res){

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    if(!file){
      throw new NotFoundException('Please select a file to upload');
    }

    const booking =  await this.bookingRepository.findOne({where : {uid: bookingUId}});
    const agentId = booking.agentId;

    const filetype = (file.originalname).split('.')[1];
    const fileName = booking.bookingId;
    const keyvalue = agentId +'/'+ fileName+'/'+'ReissueCopy-'+uuidv4()+'.' + filetype;

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: 'B2B/' + keyvalue,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype
    };

    const reissue =  await this.reissueRepository.findOne({where : {bookingId: booking.bookingId}});

    this.s3.putObject(params, (err, data) => {
      if (err) {  
        res.status(500).json({ status: 'error', message: 'Something Error In Code'});
      } else {
        const url = process.env.CDN_SPACES+'/B2B/' + keyvalue;

        reissue.reissuecopy = url;
        this.reissueRepository.update(reissue.id, reissue);
        res.status(201).json({ status: 'success', message: 'File uploaded successfully', fileurl: url });
      }
    });

  }
}

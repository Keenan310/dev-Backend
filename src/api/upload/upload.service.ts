// src/api/upload/upload.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { extname } from 'path';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AgentModel } from '../agent/agent.model';
import { AuthService } from '../auth/auth.service';
import { BookingModel } from '../booking/booking.model';
import { ReissueModel } from '../reissue/reissue.model';
import { PromotionModel } from '../promotion/promotion.model';
import { DepositModel } from '../deposit/deposit.model';
import { PassengerModel } from '../passenger/passenger.model';
import { MailService } from 'src/mail/mail.service';
import { StaffModel } from '../staff/staff.model';
import { AdminModel } from '../admin/admin.model';
import { AuthUtils } from '../auth/auth.utils';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import * as fs from 'fs';
import * as path from 'path';

/*function saveBufferToStorage(key: string, buffer: Buffer) {
  const baseDir = process.env.STORAGE_DIR || '/opt/storage/keenan-b2b';
  const fullPath = path.join(baseDir, key);

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, buffer);

  const baseUrl = process.env.STORAGE_BASE_URL || 'https://storage.keenantravel.com';
  return `${baseUrl}/${key}`;
}
*/
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

async function saveBufferToStorage(key: string, buffer: Buffer, contentType?: string) {
  const baseUrl = process.env.STORAGE_BASE_URL || 'https://storage.keenantravel.com';

  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType || 'application/octet-stream',
    }),
  );

  return `${baseUrl}/${key}`;
}

@Injectable()
export class UploadService {
  constructor(
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
    private readonly authUtils: AuthUtils,
  ) {}

  async signup(agentDto: AgentModel, files): Promise<any> {
    const existAdmin = await this.adminRepository.findOne({ where: { email: agentDto.email } });
    if (existAdmin) throw new HttpException('Email already exist as Admin', HttpStatus.CONFLICT);

    const existStaff = await this.staffRepository.findOne({ where: { email: agentDto.email } });
    if (existStaff) throw new HttpException('Email already exist as Staff', HttpStatus.CONFLICT);

    const existingAgent = await this.agentRepository.findOne({
      where: [{ email: agentDto.email }, { phone: agentDto.phone }],
    });

    if (existingAgent?.email === agentDto.email) {
      throw new HttpException('Email already exist', HttpStatus.CONFLICT);
    } else if (existingAgent?.phone === agentDto.phone) {
      throw new HttpException('Phone already exist', HttpStatus.CONFLICT);
    }

    const agent = await this.agentRepository.find({ order: { id: 'DESC' }, take: 1 });

    let agentId: string;
    if (agent.length === 1) {
      const old_agent_id = (agent[0].agentId).replace('KTA', '');
      agentId = 'KTA' + (parseInt(old_agent_id) + 1);
    } else {
      agentId = 'KTAA1000';
    }

    const hashedPassword = await bcrypt.hash(agentDto.password, 9);
    agentDto.password = hashedPassword;
    agentDto.agentId = agentId;
    agentDto.status = 'pending';
    agentDto.currency = 'AED';

    agentDto.ip = (await this.authUtils.getPublicIp()) || 'N/F';
    agentDto.searchlimit = 100;

    try {
      if (files?.nid?.[0]) {
        const nidFileType = files.nid[0].originalname.split('.').pop();
        const nidKey = `B2B/${agentId}/Docs/nid.${nidFileType}`;
        //agentDto.nid = saveBufferToStorage(nidKey, files.nid[0].buffer);
        agentDto.nid = await saveBufferToStorage(nidKey, files.nid[0].buffer, files.nid[0].mimetype);
      }

      if (files?.tl?.[0]) {
        const tlFileType = files.tl[0].originalname.split('.').pop();
        const tlKey = `B2B/${agentId}/Docs/tl.${tlFileType}`;
        
       // agentDto.tradelicense = saveBufferToStorage(tlKey, files.tl[0].buffer);
       agentDto.tradelicense = await saveBufferToStorage(tlKey, files.tl[0].buffer, files.tl[0].mimetype);
      }

      const responseData = await this.agentRepository.save(agentDto);
      await this.mailService.signUpMail(agentDto);
      return responseData;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      throw new Error('An error occurred during the operation.');
    }
  }

  async uploadAgentLogo(header: any, file, res) {
    const agent = await this.authService.verifyAgentToken(header);
    if (!agent) throw new UnauthorizedException();

    if (!file) throw new NotFoundException('Please select a file to upload');

    const agentId = agent.agentId;
    const filetype = file.originalname.split('.')[1];
    const keyvalue = `${agentId}/companylogo.${filetype}`;
    const key = `B2B/${keyvalue}`;

    try {
      //const url = saveBufferToStorage(key, file.buffer);
      const url = await saveBufferToStorage(key, file.buffer, file.mimetype);

      agent['logo'] = url;
      await this.agentRepository.update(agent.id, agent);

      return res.status(201).json({
        status: 'success',
        message: 'Logo uploaded successfully',
        fileurl: url,
      });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'Something Error In Code' });
    }
  }

  async updateDocuments(header: any, option: string, file, res) {
    const agent = await this.authService.verifyAgentToken(header);
    if (!agent) throw new UnauthorizedException();

    if (!file) throw new NotFoundException('Please select a file to upload');

    const agentId = agent.agentId;
    const filetype = file.originalname.split('.')[1];

    let folder: string;
    if (option === 'tl') folder = 'tradelicense';
    else if (option === 'nid') folder = 'nid';

    const keyvalue = `${agentId}/${folder}.${filetype}`;
    const key = `B2B/${keyvalue}`;

    try {
      //const url = saveBufferToStorage(key, file.buffer);
      const url = await saveBufferToStorage(key, file.buffer, file.mimetype);

      agent[folder] = url;
      await this.agentRepository.update(agent.id, agent);

      return res.status(201).json({
        status: 'success',
        message: `${folder} uploaded successfully`,
        fileurl: url,
      });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'Something Error In Code' });
    }
  }

  async uploadPassengerDocs(docs: string, paxUId: string, file, res) {
    if (!file) throw new NotFoundException('Please select a file to upload');

    const passenger = await this.passengerRepository.findOne({ where: { uid: paxUId } });
    if (!passenger) throw new NotFoundException('Passenger not found');

    const filetype = file.originalname.split('.')[1];

    let keyvalue: string;
    if (docs === 'passport') keyvalue = `PassengerDocs/${paxUId}/passportcopy.${filetype}`;
    else if (docs === 'visa') keyvalue = `PassengerDocs/${paxUId}/visacopy.${filetype}`;

    const key = `B2B/${keyvalue}`;

    try {
      // const url = saveBufferToStorage(key, file.buffer);
      const url = await saveBufferToStorage(key, file.buffer, file.mimetype);

      if (docs === 'visa') passenger['visa'] = url;
      else if (docs === 'passport') passenger['passport'] = url;

      await this.passengerRepository.update(passenger.id, passenger);

      return res.status(201).json({
        status: 'success',
        message: `${docs.toLocaleUpperCase()} Copy uploaded successfully`,
        fileurl: url,
      });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'Something Error In Code' });
    }
  }

  async addDeposit(
    header: any,
    amount: number,
    sender: string,
    receiver: string,
    paymentway: string,
    reference: string,
    file: any,
    res,
  ) {
    const agent = await this.authService.verifyAgentToken(header);
    if (!agent) throw new UnauthorizedException();

    const agentId = agent.agentId;
    const existingTrxId = await this.depositRepository.findOne({ where: { ref: reference, agentId } });
    if (existingTrxId) throw new HttpException('Duplicate Transaction Id', HttpStatus.CONFLICT);

    const allowedFileTypes = ['png', 'jpg', 'jpeg', 'pdf', 'PNG', 'JPG', 'JPEG'];
    const fileType = extname(file.originalname).toLowerCase().slice(1);

    if (!allowedFileTypes.includes(fileType)) {
      throw new HttpException('Invalid file formate', HttpStatus.FORBIDDEN);
    } else if (file.size > Number(process.env.ALLOW_IMAGE_SIZE || 3000000)) {
      throw new HttpException('File size exceeds the limit max 2MB', HttpStatus.FORBIDDEN);
    }

    const fileName = uuidv4();
    const keyvalue = `${agentId}/deposit/${fileName}.${fileType}`;
    const key = `B2B/${keyvalue}`;

    let url: string;
    try {
      // url = saveBufferToStorage(key, file.buffer);
      url = await saveBufferToStorage(key, file.buffer, file.mimetype);
    } catch (err) {
      throw new HttpException('Something Error', HttpStatus.BAD_REQUEST);
    }

    const deposit = await this.depositRepository.find({ order: { id: 'DESC' }, take: 1 });

    let depositId: string;
    if (deposit.length === 1) {
      const old_deposit_id = (deposit[0].depositId).replace('KTD', '');
      depositId = 'KTD' + (parseInt(old_deposit_id) + 1);
    } else {
      depositId = 'KTD1000';
    }

    const depositModel = new DepositModel();
    depositModel.depositId = depositId;
    depositModel.agentId = agent.agentId;
    depositModel.sender = sender;
    depositModel.receiver = receiver;
    depositModel.paymentway = paymentway;
    depositModel.ref = reference;
    depositModel.status = 'pending';
    depositModel.amount = amount;
    depositModel.attachment = url;
    depositModel.companyname = agent.company;

    const depostResult = await this.depositRepository.save(depositModel);
    await this.mailService.depositRequest(depositModel, file);
    return res.status(201).json(depostResult);
  }

  async addPromotion(header: any, category: string, file, res) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);
    if (!verifyAdminId) throw new UnauthorizedException();

    if (!file) throw new NotFoundException('Please select a file to upload');

    const filetype = file.originalname.split('.')[1];
    const fileName = uuidv4();
    const keyvalue = `Promotion/${fileName}.${filetype}`;
    const key = `B2B/${keyvalue}`;

    try {
      // const url = saveBufferToStorage(key, file.buffer);
      const url = await saveBufferToStorage(key, file.buffer, file.mimetype);

      const data = new PromotionModel();
      data.image = url;
      data.category = category;
      data.caption = category;

      await this.promotionRepository.save(data);

      return res.status(201).json({
        status: 'success',
        message: 'Promotion uploaded successfully',
        fileurl: url,
      });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'Something Error In Code' });
    }
  }

  async uploadReissueTicketCopy(header: any, bookingUId: string, UId: string, file, res) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);
    if (!verifyAdminId) throw new UnauthorizedException();

    if (!file) throw new NotFoundException('Please select a file to upload');

    const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
    const agentId = booking.agentId;

    const filetype = file.originalname.split('.')[1];
    const fileName = booking.bookingId;
    const keyvalue = `${agentId}/${fileName}/ReissueCopy-${uuidv4()}.${filetype}`;
    const key = `B2B/${keyvalue}`;

    const reissue = await this.reissueRepository.findOne({ where: { uid: UId } });

    try {
      // const url = saveBufferToStorage(key, file.buffer);
      const url = await saveBufferToStorage(key, file.buffer, file.mimetype);

      reissue.reissuecopy = url;
      await this.reissueRepository.update(reissue.id, reissue);

      return res.status(201).json({
        status: 'success',
        message: 'File uploaded successfully',
        fileurl: url,
      });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'Something Error In Code' });
    }
  }
}

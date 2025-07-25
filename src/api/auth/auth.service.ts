
import { HttpException, HttpStatus, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { MoreThan, Repository } from 'typeorm';
import { AgentModel } from '../agent/agent.model';
import { AuthModel, OTPModel } from './auth.model';
import { AdminModel } from '../admin/admin.model';
import { JwtService } from '@nestjs/jwt';
import { StaffModel } from '../staff/staff.model';
import { MailService } from 'src/mail/mail.service';
import { AuthUtils } from './auth.utils';
import * as jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
dotenv.config()

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    @InjectRepository(StaffModel)
    private readonly staffRepository: Repository<StaffModel>,
    @InjectRepository(AdminModel)
    private readonly adminRepository: Repository<AdminModel>,
    @InjectRepository(OTPModel)
    private readonly otpRepository: Repository<OTPModel>,
    private jwtService: JwtService,
    private mailService: MailService,
    private authUtils: AuthUtils
  ) {}

  async adminLogin(authDto : AuthModel) {

    const existAdmin = await this.adminRepository.findOne({where: { email: authDto.email }});
    if (!existAdmin) {
      throw new NotFoundException("Admin not found");
    }

    if (existAdmin.status != 'active') {
      throw new HttpException(`${existAdmin.status} pending`, HttpStatus.CONFLICT);
    }

    if (authDto.password === existAdmin.password) {
      const otp = await this.generateOTP();
      existAdmin.otp = otp;
      await this.adminRepository.update(existAdmin.id, existAdmin);
      await this.mailService.OTPSend2FA(existAdmin.email, otp);
      return {
        "status": 'OK',
        "message": "OTP send to email"
      }
    }

    throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
  }

  async adminsignin(authDto : AuthModel) {

    const existAdmin = await this.adminRepository.findOne({where: { email: authDto.email }});

    if (!existAdmin) {
      throw new NotFoundException("Admin not found");
    }

    if (existAdmin.status != 'active') {
      throw new HttpException(`${existAdmin.status} pending`, HttpStatus.CONFLICT);
    }

    if (authDto.password === existAdmin.password) {
      const payload = { adminUId: existAdmin.uid};
      const access_token = await this.jwtService.signAsync(payload);
      const {password, ...adminData} = existAdmin;

      adminData['token'] = access_token;
      return adminData;
    }

    throw new HttpException('Wrong password', HttpStatus.CONFLICT);
  }

  async agentLogin(authDto : AuthModel) {

    const existAgent = await this.agentRepository.findOne({where: { email: authDto.email }});
    const existStaff = await this.staffRepository.findOne({where: { email: authDto.email }});

    if(existAgent){
      const isMatch = await bcrypt.compare(authDto.password, existAgent.password);
      if (isMatch) {
        const otp = await this.generateOTP();
        existAgent.otp = otp;
        await this.agentRepository.update(existAgent.id, existAgent);
        await this.mailService.OTPSend2FA(existAgent.email, otp);
        return {
          "status": 'OK',
          "message": "OTP send to email"
        }
      }else{
        throw new HttpException('Agent Wrong password', HttpStatus.UNAUTHORIZED);
      }
    }else if(existStaff){
      const isMatch = await bcrypt.compare(authDto.password, existStaff.password);;
      if (isMatch) {
        const otp = await this.generateOTP();
        existStaff.otp = otp;
        await this.staffRepository.update(existStaff.id, existStaff);
        await this.mailService.OTPSend2FA(existStaff.email, otp);
        return {
          "status": 'OK',
          "message": "OTP send to email"
        }

      }else{
        throw new HttpException('Staff Wrong password', HttpStatus.UNAUTHORIZED);
      }

    }else{
      throw new NotFoundException('User Not Found');
    }
  }

  async agentsignin(authDto : AuthModel) {

    const existAgent = await this.agentRepository.findOne({where: { email: authDto.email }});
    const existStaff = await this.staffRepository.findOne({where: { email: authDto.email }});

    if(existAgent){
      const isMatch = await bcrypt.compare(authDto.password, existAgent.password);
      if (isMatch) {
        delete existAgent.password;
        existAgent['usertype'] = 'agent';
        existAgent["staffdata"] = [];

        const payload = {
          company: existAgent.company,
          uid: existAgent.uid,
          name : existAgent.name,
          email: existAgent.email,
          phone: existAgent.phone,
          status: existAgent.status,
          staffdata: {}
        };
        const token = this.jwtService.sign(payload);
        return {access_token: token}

      }else{
        throw new HttpException('Agent Wrong password', HttpStatus.UNAUTHORIZED);
      }
    }else if(existStaff){
      const isMatch = await bcrypt.compare(authDto.password, existStaff.password);;
      if (isMatch) {
        const existAgent = await this.agentRepository.findOne({where: { agentId: existStaff.agentId }});
        delete existStaff.password;
        delete existAgent.password;
        existAgent['usertype'] = 'staff';
        existAgent['staffdata'] = existStaff;

        const payload = {
          company: existAgent.company,
          uid: existAgent.uid,
          name : existAgent.name,
          phone: existAgent.phone,
          email: existAgent.email,
          status: existAgent.status,
          staffdata: {
            email: existStaff.email,
            name: existStaff.name,
            role : existStaff.role,
            status: existStaff.status,
            uid: existStaff.uid
          }
        };
        const token = this.jwtService.sign(payload);
        return {access_token: token}

      }else{
        throw new HttpException('Staff Wrong password', HttpStatus.UNAUTHORIZED);
      }

    }else{
      throw new NotFoundException('User Not Found');
    }
  }

  async agentForgetPassword(email: string) {

    const existAgent = await this.agentRepository.findOne({where: { email: email }});

    if (!existAgent) {
      throw new NotFoundException("Agent not found. Please Sign Up or Contact To The Admin");
    }

    if(existAgent){

      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);

      const OTPCount = await this.otpRepository.count({where: {
          created_at: MoreThan(oneHourAgo),
          agentUId: existAgent.uid
        }
      });

      if(OTPCount > 3){
        throw new NotAcceptableException('Too many attempts. Try Later');
      }

      const OTPcode = await this.authUtils.generateOTP();

      const otpModel =  new OTPModel();
      otpModel.agentUId = existAgent.uid;
      otpModel.code = OTPcode.toString();


      const OTP = await this.otpRepository.save(otpModel);
      await this.mailService.OTPSend(existAgent, OTPcode);

      if(OTP){
        return { message: 'Check OTP for Mail'};
      }else{
        return { message: 'Something error'};
      }

    }
  }

  async verifyOTPUpdatePassword(code: string, newpassword: string) {

    const existOTP = await this.otpRepository.findOne({where: { code: code }});

    if (!existOTP) {
      throw new NotFoundException("Invalid OTP Code");
    }

    const existAgent = await this.agentRepository.findOne({where: { uid: existOTP.agentUId }});

    if(existAgent){
      const newhashedPassword = await this.authUtils.encrypt(newpassword);
      existAgent['password'] = newhashedPassword;

      const resetPassword = await this.agentRepository.update(existAgent.id, existAgent);

      if(resetPassword.affected === 1){
        await this.otpRepository.delete(existOTP.id);
        await this.mailService.forgetPasswordMail(existAgent);
        return { message: 'Password updated successfully.'};
      }else{
        return { message: 'Something error'};
      }

    }
  }

  async verifyOTPAgentLogin(otp : string) {

    const existAgent = await this.agentRepository.findOne({where: { otp: otp }});
    const existStaff = await this.staffRepository.findOne({where: { otp: otp }});

    if(existAgent){
        delete existAgent.password;
        existAgent['otp'] = await this.generateOTP();
        await this.agentRepository.update(existAgent.id, existAgent);
        
        existAgent['usertype'] = 'agent';
        existAgent["staffdata"] = [];

        const payload = {
          company: existAgent.company,
          uid: existAgent.uid,
          name : existAgent.name,
          email: existAgent.email,
          phone: existAgent.phone,
          status: existAgent.status,
          staffdata: {}
        };
        const token = this.jwtService.sign(payload);
        return {access_token: token}
    }else if(existStaff){
        const existAgent = await this.agentRepository.findOne({where: { agentId: existStaff.agentId }});
        existStaff['otp'] = await this.generateOTP();
        await this.staffRepository.update(existStaff.id, existStaff);
        
        delete existStaff.password;
        delete existAgent.password;
        existAgent['usertype'] = 'staff';
        existAgent['staffdata'] = existStaff;

        const payload = {
          company: existAgent.company,
          uid: existAgent.uid,
          name : existAgent.name,
          phone: existAgent.phone,
          email: existAgent.email,
          status: existAgent.status,
          staffdata: {
            email: existStaff.email,
            name: existStaff.name,
            role : existStaff.role,
            status: existStaff.status,
            uid: existStaff.uid
          }
        };
        const token = this.jwtService.sign(payload);
        return {access_token: token}

    }else{
      throw new HttpException('Wrong OTP', HttpStatus.UNAUTHORIZED);
    }
  }

  async verifyOTPAdminLogin(otp: string) {

    const existAdmin = await this.adminRepository.findOne({where: { otp: otp }});
    if (!existAdmin) {
      throw new NotFoundException("Wrong OTP");
    }

    if (existAdmin.status != 'active') {
      throw new HttpException(`${existAdmin.status} pending`, HttpStatus.CONFLICT);
    }

      const otpNew = await this.generateOTP();
      existAdmin['otp'] = otpNew;
      await this.adminRepository.update(existAdmin.id, existAdmin);

      delete existAdmin.id;
      delete existAdmin.otp;
      const payload = { adminUId: existAdmin.uid};
      const access_token = await this.jwtService.signAsync(payload);
      const {password, ...adminData} = existAdmin;

      adminData['token'] = access_token;
      return adminData;

  }

  async generateJwtToken(payload: any){
      const access_token = this.jwtService.sign(payload); 
      return access_token;
  }

  async verifyAdminToken(header: any){

    try{
      const token =  header['authorization'].replace('Bearer ','');

      if(!token){
        throw new UnauthorizedException();
      }

      jwt.verify(token, process.env.JWT_SECREATE_KEY);
      const adminToken = this.jwtService.decode(token);
      const adminData = await this.adminRepository.findOne({where : {uid: adminToken.adminUId}});

      if(!adminData){
          throw new UnauthorizedException();
      }

      return adminData;

    } catch(e){
      if (e instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException();
    }

  }

  async verifyAgentToken(header: any): Promise<any> {

    try {
      const token = header.authorization.replace('Bearer ', '');

      jwt.verify(token, process.env.JWT_SECREATE_KEY);
      const agentToken = this.jwtService.decode(token);
      const agentData = await this.agentRepository.findOne({ where: { uid: agentToken.uid } });

      if (!agentData) {
        throw new UnauthorizedException();
      }

      return agentData;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }

      throw new UnauthorizedException('Invalid token');
    }
  }

  async generateOTP(): Promise<string>{
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }
}

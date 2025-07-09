import { HttpException, HttpStatus, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AdminModel, AdminModelUpdate } from './admin.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from "dotenv"
import { StaffModel } from '../staff/staff.model';
import { AgentModel } from '../agent/agent.model';
import { AuthService } from '../auth/auth.service';
dotenv.config()


@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminModel)
    private readonly adminRepository: Repository<AdminModel>,
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    @InjectRepository(StaffModel)
    private readonly staffRepository: Repository<StaffModel>,
    private authService: AuthService
  ) {}

  async create(header: any, createAdminDto: AdminModel) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const existAdmin = await this.adminRepository.findOne({where: { email: createAdminDto.email }});
    const existAgent = await this.agentRepository.findOne({where: { email: createAdminDto.email }});
    const existStaff = await this.staffRepository.findOne({where: { email: createAdminDto.email }});
    if (existAdmin) {
      throw new HttpException("Admin already exists", HttpStatus.CONFLICT)
    }

    if (existAgent) {
      throw new HttpException("Email already exists, agent list", HttpStatus.CONFLICT)
    }

    if (existStaff) {
      throw new HttpException("Email already exists, staff list", HttpStatus.CONFLICT)
    }

    
    
    const admin = await this.adminRepository.find({order: { id: 'DESC' }, take : 1});

    let adminId='';
    if(admin.length == 1){
      let old_admin_id = (admin[0].adminId).replace("KTAD",'');
      adminId = "KTAD" + (parseInt(old_admin_id) + 1);
    }else{
      adminId = 'KTAD1000';
    }

    //const hashedPassword =  await bcrypt.hash(createAdminDto.password, 10);

    createAdminDto["adminId"] = adminId;
    //createAdminDto["password"] = hashedPassword;
    createAdminDto["status"] = "active";

    return await this.adminRepository.save(createAdminDto);
  }

  async findAll(header: any) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const allAdmins = await this.adminRepository.find();
    return allAdmins.slice(1);

  }

  async findOne(header:any , uid: string) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    
    const admin = await this.adminRepository.findOneBy({uid: uid });

    if (!admin) {
      throw new NotFoundException();
    }

    return admin;
  }

  async update(header: any , uid: string, updateAdminDto: AdminModelUpdate) {

    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const admin = await this.adminRepository.findOne({where: { uid: uid }});
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return this.adminRepository.update(admin.id, updateAdminDto)

  }

  async delete(header: any, uid: string) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const admin = await this.adminRepository.findOne({where: { uid: uid }});
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if(verifyAdminId.role !== 'superadmin' && verifyAdminId.role !=='admin'){
      throw new NotAcceptableException("Only Super admin can delete account");
    }

    return this.adminRepository.delete(admin.id)
  }

}

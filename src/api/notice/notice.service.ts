import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { NoticeModel, NoticeUpdateModel } from './notice.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeModel)
    private readonly noticeRepository: Repository<NoticeModel>,
    private readonly authService: AuthService
  ) {}

  async create(header: any, createNoticeDto: NoticeModel) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }
    
    return await this.noticeRepository.save(createNoticeDto);
  }

  async findAllAdmin(header: any): Promise<NoticeModel[]>{
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    return await this.noticeRepository.find();
  }

  async findAllAgent(header: any){

    const agent = await this.authService.verifyAgentToken(header);

    if(!agent){
        throw new UnauthorizedException();
    }

    return await this.noticeRepository.find();
  }


  async findOne(header: any, uid : string){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    return await this.noticeRepository.findOne({where: { uid: uid }});
  }

  async update(header: any,uid: string, updateNoticeDto: NoticeUpdateModel){
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const notice = await this.noticeRepository.findOne({
      where: { uid: uid },
    });
    if (!notice) {
      throw new NotFoundException('Invalid Id');
    }

    return await this.noticeRepository.update(notice.id, updateNoticeDto)
  }

  async remove(header: any, uid: string) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if(!verifyAdminId){
        throw new UnauthorizedException();
    }

    const notice = await this.noticeRepository.findOne({
      where: { uid: uid },
    });
    if (!notice) {
      throw new NotFoundException('Invalid Id');
    }

    return await this.noticeRepository.delete(notice.id);

  }
}

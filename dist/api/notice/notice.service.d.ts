import { NoticeModel, NoticeUpdateModel } from './notice.model';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
export declare class NoticeService {
    private readonly noticeRepository;
    private readonly authService;
    constructor(noticeRepository: Repository<NoticeModel>, authService: AuthService);
    create(header: any, createNoticeDto: NoticeModel): Promise<NoticeModel>;
    findAllAdmin(header: any): Promise<NoticeModel[]>;
    findAllAgent(header: any): Promise<NoticeModel[]>;
    findOne(header: any, uid: string): Promise<NoticeModel>;
    update(header: any, uid: string, updateNoticeDto: NoticeUpdateModel): Promise<import("typeorm").UpdateResult>;
    remove(header: any, uid: string): Promise<import("typeorm").DeleteResult>;
}

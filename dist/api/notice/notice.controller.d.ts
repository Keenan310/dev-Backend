import { NoticeService } from './notice.service';
import { NoticeModel, NoticeUpdateModel } from './notice.model';
export declare class NoticeController {
    private readonly noticeService;
    constructor(noticeService: NoticeService);
    create(header: Headers, createNoticeDto: NoticeModel): Promise<NoticeModel>;
    findAllNoticeAdmin(header: Headers): Promise<NoticeModel[]>;
    findAllNoticeAgent(header: Headers): Promise<NoticeModel[]>;
    update(header: Headers, uid: string, updateNoticeDto: NoticeUpdateModel): Promise<import("typeorm").UpdateResult>;
    remove(header: Headers, uid: string): Promise<import("typeorm").DeleteResult>;
}

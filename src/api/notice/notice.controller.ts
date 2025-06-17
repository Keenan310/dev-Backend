import { Controller, Get, Post, Body, Param, Delete, Headers, Patch } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeModel, NoticeUpdateModel } from './notice.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags("Notice")
@Controller()
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @ApiBearerAuth('access_token')
  @Post('admin/notice')
  create(
    @Headers() header: Headers,
    @Body() createNoticeDto: NoticeModel) {
    return this.noticeService.create(header, createNoticeDto);
  }

  @ApiBearerAuth('access_token')
  @Get('admin/notice/all')
  findAllNoticeAdmin(
    @Headers() header: Headers,
  ) {
    return this.noticeService.findAllAdmin(header);
  }

  @ApiBearerAuth('access_token')
  @Get('agent/notice/all')
  findAllNoticeAgent(
    @Headers() header: Headers,
  ) {
    return this.noticeService.findAllAgent(header);
  }

  @ApiBearerAuth('access_token')
  @Patch('admin/notice/:uid')
  update(
    @Headers() header: Headers,
    @Param('uid') uid: string,
    @Body() updateNoticeDto: NoticeUpdateModel) {
    return this.noticeService.update(header, uid, updateNoticeDto);
  }

  @ApiBearerAuth('access_token')
  @Delete('admin/notice/:uid')
  remove(
    @Headers() header: Headers,
    @Param('uid') uid: string) {
    return this.noticeService.remove(header, uid);
  }
}

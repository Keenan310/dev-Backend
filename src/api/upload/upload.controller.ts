import { Body, Controller, Headers, HttpException, HttpStatus, NotAcceptableException, NotFoundException, Param, Post, Query, Res, UploadedFile, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { AgentModel } from '../agent/agent.model';

@ApiExcludeController()
@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiTags('Agent Sign UP')
  @Post('agent/signup')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'nid', maxCount: 1 },
    { name: 'tl', maxCount: 1 },
  ]))
  signUp(
    @Body() agentDto: AgentModel,
    @UploadedFiles() files: { nid?: Express.Multer.File[], tl?: Express.Multer.File[] }) {  

      const allowfileType = ["image/jpg", "image/png", "image/jpeg", "image/gif", "application/pdf" ];

      if(!allowfileType.includes(files?.nid?.[0]?.mimetype)){
        throw new NotAcceptableException('File Type Must be: '+ allowfileType.join(' , '))
      }else if(files?.tl && !allowfileType.includes(files?.tl?.[0]?.mimetype)){
        throw new NotAcceptableException('File Type Must be: '+ allowfileType.join(' , '))
      }

      if(files?.nid?.[0]?.size < 7000 || files?.tl?.[0]?.size < 7000){
        throw new NotAcceptableException('File Size Must Be less Than 3 MB')
      }
    return this.uploadService.signup(agentDto, files);
  }

  @ApiBearerAuth('access_token')
  @ApiTags("Agent Modules")
  @Post("agent/upload/logo")
  @ApiConsumes('multipart/form-data')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  uploadAgentLogo(
    @Headers() header: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res) {
    return this.uploadService.uploadAgentLogo(header, file, res);
  }


  @ApiBearerAuth('access_token')
  @ApiTags("Agent Modules")
  @Post("agent/upload/document")
  @ApiConsumes('multipart/form-data')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  updateDocuments(
    @Headers() header: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('option') option : string,
    @Res() res) {
    return this.uploadService.updateDocuments(header,option, file, res);
  }

  @ApiBearerAuth('access_token')
  @ApiTags("Deposit Modules")
  @Post("agent/deposit")
  @ApiConsumes('multipart/form-data')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  uploadDepositFile(
    @Headers() header: string,
    @Query('amount') amount: number, @Query('sender') sender: string,
    @Query('paymentway') paymentway: string, @Query('receiver') receiver: string,
    @Query('reference') reference:string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res) {

      if (isNaN(amount)) {
        throw new HttpException('Invalid amount. Must be a number.', HttpStatus.BAD_REQUEST);
      }else if (!sender || sender.trim() === '') {
        throw new HttpException('Sender cannot be empty. Must be a non-empty string.', HttpStatus.BAD_REQUEST);
      } else if (!receiver || receiver.trim() === '') {
        throw new HttpException('Receiver cannot be empty. Must be a non-empty string.', HttpStatus.BAD_REQUEST);
      } else if (!paymentway || paymentway.trim() === '') {
        throw new HttpException('Paymentway cannot be empty. Must be a non-empty string.', HttpStatus.BAD_REQUEST);
      } else if (!reference || reference.trim() === '') {
        throw new HttpException('Reference cannot be empty. Must be a non-empty string.', HttpStatus.BAD_REQUEST);
      }else if(!file){
        throw new NotFoundException('Please select a file to upload');
      }else if(file.size > 3000000){
        throw new HttpException('File size exceeds the limit max 3MB', HttpStatus.FORBIDDEN);
      }

    return this.uploadService.addDeposit(header,amount,sender,receiver,paymentway,reference, file, res);
  }

  @ApiTags("Promotion")
  @Post("admin/promotion/:category")
  @UseInterceptors(FileInterceptor('file'))
  addPromotion(
    @Headers() header: Headers,
    @UploadedFile() file: Express.Multer.File,
    @Param('category') category: string,
    @Res() res) {
    return this.uploadService.addPromotion(header, category, file, res);
  }

  @ApiTags("Passengers")
  @Post("agent/passenger/upload/:docs/:paxUId")
  @UseInterceptors(FileInterceptor('file'))
  uploadPassportCopy(
    @Param('docs') docs: string,
    @Param('paxUId') paxUId: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res) {
    return this.uploadService.uploadPassengerDocs(docs, paxUId, file, res);
  }


  @ApiTags("Reissue Modules")
  @Post("admin/upload/reissue/ticket/:bookingUId")
  @UseInterceptors(FileInterceptor('file'))
  uploadReissueTicketCopy(
    @Headers() header: Headers,
    @Param('bookingUId') bookingUId: string,
    @Param('UId') UId: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res) {
    return this.uploadService.uploadReissueTicketCopy(header, bookingUId,UId, file, res);
  }

}
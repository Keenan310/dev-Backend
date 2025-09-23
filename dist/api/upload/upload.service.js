"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const AWS = require("aws-sdk");
const bcrypt = require("bcrypt");
const upload_provider_service_1 = require("./upload.provider.service");
const uuid_1 = require("uuid");
const agent_model_1 = require("../agent/agent.model");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_service_1 = require("../auth/auth.service");
const booking_model_1 = require("../booking/booking.model");
const reissue_model_1 = require("../reissue/reissue.model");
const promotion_model_1 = require("../promotion/promotion.model");
const deposit_model_1 = require("../deposit/deposit.model");
const dotenv = require("dotenv");
const passenger_model_1 = require("../passenger/passenger.model");
const mail_service_1 = require("../../mail/mail.service");
const staff_model_1 = require("../staff/staff.model");
const admin_model_1 = require("../admin/admin.model");
const auth_utils_1 = require("../auth/auth.utils");
dotenv.config();
let UploadService = class UploadService {
    constructor(s3, agentRepository, passengerRepository, adminRepository, bookingRepository, staffRepository, promotionRepository, reissueRepository, depositRepository, authService, mailService, authUtils) {
        this.s3 = s3;
        this.agentRepository = agentRepository;
        this.passengerRepository = passengerRepository;
        this.adminRepository = adminRepository;
        this.bookingRepository = bookingRepository;
        this.staffRepository = staffRepository;
        this.promotionRepository = promotionRepository;
        this.reissueRepository = reissueRepository;
        this.depositRepository = depositRepository;
        this.authService = authService;
        this.mailService = mailService;
        this.authUtils = authUtils;
    }
    async signup(agentDto, files) {
        const existAdmin = await this.adminRepository.findOne({ where: { email: agentDto.email } });
        if (existAdmin) {
            throw new common_1.HttpException('Email already exist as Admin', common_1.HttpStatus.CONFLICT);
        }
        const existStaff = await this.staffRepository.findOne({ where: { email: agentDto.email } });
        if (existStaff) {
            throw new common_1.HttpException('Email already exist as Staff', common_1.HttpStatus.CONFLICT);
        }
        const existingAgent = await this.agentRepository.findOne({ where: [{ email: agentDto.email }, { phone: agentDto.phone }] });
        if (existingAgent?.email === agentDto.email) {
            throw new common_1.HttpException('Email already exist', common_1.HttpStatus.CONFLICT);
        }
        else if (existingAgent?.phone === agentDto.phone) {
            throw new common_1.HttpException('Phone already exist', common_1.HttpStatus.CONFLICT);
        }
        const agent = await this.agentRepository.find({ order: { id: 'DESC' }, take: 1 });
        let agentId;
        if (agent.length === 1) {
            let old_agent_id = (agent[0].agentId).replace("KTA", '');
            agentId = "KTA" + (parseInt(old_agent_id) + 1);
        }
        else {
            agentId = 'KTAA1000';
        }
        const hashedPassword = await bcrypt.hash(agentDto.password, 9);
        agentDto.password = hashedPassword;
        agentDto.agentId = agentId;
        agentDto.status = 'pending';
        agentDto.currency = 'AED';
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
            if (nidUrl)
                agentDto.nid = nidUrl;
            if (tlUrl)
                agentDto.tradelicense = tlUrl;
            const responseData = await this.agentRepository.save(agentDto);
            await this.mailService.signUpMail(agentDto);
            return responseData;
        }
        catch (err) {
            console.log(err);
            throw new Error('An error occurred during the operation.');
        }
    }
    async uploadAgentLogo(header, file, res) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        if (!file) {
            throw new common_1.NotFoundException('Please select a file to upload');
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
                res.status(500).json({ status: 'error', message: 'Something Error In Code' });
            }
            else {
                const url = process.env.CDN_SPACES + '/B2B/' + keyvalue;
                agent['logo'] = url;
                this.agentRepository.update(agent.id, agent);
                res.status(201).json({ status: 'success', message: 'Logo uploaded successfully', fileurl: url });
            }
        });
    }
    async updateDocuments(header, option, file, res) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        if (!file) {
            throw new common_1.NotFoundException('Please select a file to upload');
        }
        const agentId = agent.agentId;
        const filetype = (file.originalname).split('.')[1];
        let folder;
        if (option === 'tl') {
            folder = 'tradelicense';
        }
        else if (option === 'nid') {
            folder = 'nid';
        }
        const keyvalue = agentId + '/' + folder + '.' + filetype;
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: 'B2B/' + keyvalue,
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: file.mimetype
        };
        this.s3.putObject(params, (err, data) => {
            if (err) {
                res.status(500).json({ status: 'error', message: 'Something Error In Code' });
            }
            else {
                const url = process.env.CDN_SPACES + '/B2B/' + keyvalue;
                agent[folder] = url;
                this.agentRepository.update(agent.id, agent);
                res.status(201).json({ status: 'success', message: folder + ' uploaded successfully', fileurl: url });
            }
        });
    }
    async uploadPassengerDocs(docs, paxUId, file, res) {
        if (!file) {
            throw new common_1.NotFoundException('Please select a file to upload');
        }
        const passenger = await this.passengerRepository.findOne({ where: { uid: paxUId } });
        if (!passenger) {
            throw new common_1.NotFoundException('Passenger not found');
        }
        const filetype = (file.originalname).split('.')[1];
        let keyvalue;
        if (docs === 'passport') {
            keyvalue = 'PassengerDocs/' + paxUId + '/passportcopy' + '.' + filetype;
        }
        else if (docs === 'visa') {
            keyvalue = 'PassengerDocs/' + paxUId + '/visacopy' + '.' + filetype;
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
                res.status(500).json({ status: 'error', message: 'Something Error In Code' });
            }
            else {
                const url = process.env.CDN_SPACES + '/B2B/' + keyvalue;
                if (docs === 'visa') {
                    passenger['visa'] = url;
                }
                else if (docs === 'passport') {
                    passenger['passport'] = url;
                }
                await this.passengerRepository.update(passenger.id, passenger);
                res.status(201).json({ status: 'success', message: docs.toLocaleUpperCase() + ' Copy uploaded successfully', fileurl: url });
            }
        });
    }
    async addDeposit(header, amount, sender, receiver, paymentway, reference, file, res) {
        const agent = await this.authService.verifyAgentToken(header);
        if (!agent) {
            throw new common_1.UnauthorizedException();
        }
        const agentId = agent.agentId;
        const existingTrxId = await this.depositRepository.findOne({ where: { ref: reference, agentId: agentId } });
        if (existingTrxId) {
            throw new common_1.HttpException('Duplicate Transaction Id', common_1.HttpStatus.CONFLICT);
        }
        const allowedFileTypes = ['png', 'jpg', 'jpeg', 'pdf', 'PNG', 'JPG', 'JPEG'];
        const fileType = (0, path_1.extname)(file.originalname).toLowerCase().slice(1);
        if (!allowedFileTypes.includes(fileType)) {
            throw new common_1.HttpException('Invalid file formate', common_1.HttpStatus.FORBIDDEN);
        }
        else if (file.size > process.env.ALLOW_IMAGE_SIZE) {
            throw new common_1.HttpException('File size exceeds the limit max 2MB', common_1.HttpStatus.FORBIDDEN);
        }
        const fileName = (0, uuid_1.v4)();
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
                throw new common_1.HttpException('Something Error', common_1.HttpStatus.BAD_REQUEST);
            }
            else {
                const url = process.env.CDN_SPACES + '/B2B/' + keyvalue;
                const deposit = await this.depositRepository.find({
                    order: { id: 'DESC' }, take: 1,
                });
                let depositId;
                if (deposit.length === 1) {
                    let old_deposit_id = (deposit[0].depositId).replace("KTD", '');
                    depositId = "KTD" + (parseInt(old_deposit_id) + 1);
                }
                else {
                    depositId = 'KTD1000';
                }
                const depositModel = new deposit_model_1.DepositModel;
                depositModel.depositId = depositId;
                depositModel.agentId = agent.agentId;
                depositModel.sender = sender;
                depositModel.receiver = receiver;
                depositModel.paymentway = paymentway;
                depositModel.ref = reference;
                depositModel.status = "pending";
                depositModel.amount = amount;
                depositModel.attachment = url;
                depositModel.companyname = agent.company;
                const depostResult = await this.depositRepository.save(depositModel);
                await this.mailService.depositRequest(depositModel, file);
                res.status(201).json(depostResult);
            }
        });
    }
    async addPromotion(header, category, file, res) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        if (!file) {
            throw new common_1.NotFoundException('Please select a file to upload');
        }
        const filetype = (file.originalname).split('.')[1];
        const fileName = (0, uuid_1.v4)();
        const keyvalue = 'Promotion/' + fileName + '.' + filetype;
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: 'B2B/' + keyvalue,
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: file.mimetype
        };
        this.s3.putObject(params, (err, data) => {
            if (err) {
                res.status(500).json({ status: 'error', message: 'Something Error In Code' });
            }
            else {
                const url = process.env.CDN_SPACES + '/B2B/' + keyvalue;
                const data = new promotion_model_1.PromotionModel();
                data.image = url;
                data.category = category;
                data.caption = category;
                this.promotionRepository.save(data);
                res.status(201).json({ status: 'success', message: 'Promotion uploaded successfully', fileurl: url });
            }
        });
    }
    async uploadReissueTicketCopy(header, bookingUId, UId, file, res) {
        const verifyAdminId = await this.authService.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        if (!file) {
            throw new common_1.NotFoundException('Please select a file to upload');
        }
        const booking = await this.bookingRepository.findOne({ where: { uid: bookingUId } });
        const agentId = booking.agentId;
        const filetype = (file.originalname).split('.')[1];
        const fileName = booking.bookingId;
        const keyvalue = agentId + '/' + fileName + '/' + 'ReissueCopy-' + (0, uuid_1.v4)() + '.' + filetype;
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: 'B2B/' + keyvalue,
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: file.mimetype
        };
        const reissue = await this.reissueRepository.findOne({ where: { uid: UId } });
        this.s3.putObject(params, (err, data) => {
            if (err) {
                res.status(500).json({ status: 'error', message: 'Something Error In Code' });
            }
            else {
                const url = process.env.CDN_SPACES + '/B2B/' + keyvalue;
                reissue.reissuecopy = url;
                this.reissueRepository.update(reissue.id, reissue);
                res.status(201).json({ status: 'success', message: 'File uploaded successfully', fileurl: url });
            }
        });
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(upload_provider_service_1.DoSpacesServiceLib)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_model_1.AgentModel)),
    __param(2, (0, typeorm_1.InjectRepository)(passenger_model_1.PassengerModel)),
    __param(3, (0, typeorm_1.InjectRepository)(admin_model_1.AdminModel)),
    __param(4, (0, typeorm_1.InjectRepository)(booking_model_1.BookingModel)),
    __param(5, (0, typeorm_1.InjectRepository)(staff_model_1.StaffModel)),
    __param(6, (0, typeorm_1.InjectRepository)(promotion_model_1.PromotionModel)),
    __param(7, (0, typeorm_1.InjectRepository)(reissue_model_1.ReissueModel)),
    __param(8, (0, typeorm_1.InjectRepository)(deposit_model_1.DepositModel)),
    __metadata("design:paramtypes", [AWS.S3, typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService,
        mail_service_1.MailService,
        auth_utils_1.AuthUtils])
], UploadService);
//# sourceMappingURL=upload.service.js.map
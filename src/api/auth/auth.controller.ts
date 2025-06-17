import { Controller, Post, Body, Param, Res, UsePipes, ValidationPipe, UseInterceptors, UploadedFiles, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Req, ParseFilePipeBuilder, HttpStatus, NotAcceptableException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthModel } from './auth.model';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Agent sign in', description: 'Only agent can sign in here' })
  @Post('signin')
  signin(@Body() authModel: AuthModel,) {
    return this.authService.agentsignin(authModel);
  }

  @ApiOperation({ summary: 'Admin sign in', description: 'Only admin can sign in' })
  @Post('admin/signin')
  adminsignin(
    @Body() authModel: AuthModel) {
    return this.authService.adminsignin(authModel);
  }

  @ApiOperation({ summary: 'Agent forget Password', description: 'Only agent can' })
  @Post('agent/forgetpassword/:email')
  forgetPasswordAgent(
    @Param('email') email : string) {
    return this.authService.agentForgetPassword(email);
  }

  @ApiOperation({ summary: 'Agent verify OTP', description: 'Only Agent can' })
  @Post('agent/verify/:otp/:newpassword')
  verifyOTPagent(
    @Param('otp') code : string,
    @Param('newpassword') newpassword : string) {
    return this.authService.verifyOTPUpdatePassword(code, newpassword);
  }
}

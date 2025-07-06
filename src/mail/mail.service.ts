import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { AgentModel } from 'src/api/agent/agent.model';
import { BookingModel } from 'src/api/booking/booking.model';
import { DepositModel } from 'src/api/deposit/deposit.model';
import { AgentLedgerModel } from 'src/api/report/report.model';
import { Repository } from 'typeorm';
@Injectable()
export class MailService {
  private transporter: any;
  constructor(
    @InjectRepository(AgentModel)
    private readonly agentRepository: Repository<AgentModel>,
    ) {

    this.transporter = nodemailer.createTransport({
      host: `${process.env.EMAIL_HOST}`,
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.EMAIL_USERNAME}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
    });

  }

  async OTPSend(agentData: AgentModel, OTPcode: number){
    const bodyEmail = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Forgot Password</title>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td bgcolor="#ffffff" style="padding: 20px; text-align: center;">
            <h1 style="color: #333333;">OTP</h1>
            <p style="color: #666666;">No worries! Follow the instructions below to reset your password:</p>
            <p style="color: #666666;"><strong>Step 1:</strong> Here is your new Ontime Password : ${OTPcode}</p>
            <p style="color: #666666;">Thank you,<br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Project OTA " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email,
      subject: "OTP",
      html: bodyEmail,
    };

  await this.transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
      if (error) {
        // console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }

  async forgetPasswordMail(agentData: AgentModel){
    const bodyEmail = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Forgot Password</title>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td bgcolor="#ffffff" style="padding: 20px; text-align: center;">
            <h1 style="color: #333333;">Password Changed</h1>
            <p style="color: #666666;"><strong>Step 1:</strong> Password Changed Successfully</p>
            <p style="color: #666666;">Thank you,<br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Project OTA " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email,
      subject: "Pasword Recovery",
      html: bodyEmail,
    };

  await this.transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
      if (error) {
        console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }

  async resetPasswordMail(agentData: AgentModel, newPassword : string){
    const bodyEmail = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Forgot Password</title>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td bgcolor="#ffffff" style="padding: 20px; text-align: center;">
            <h1 style="color: #333333;">Reset Your Password?</h1>
            <p style="color: #666666;">No worries! your new password: </p>
            <p style="color: #666666;"><strong>Step 1:</strong> Password Reset Successfully</p>
            <p style="color: #666666;">Thank you,<br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Project OTA " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email,
      subject: "Reset Pasword - as Request",
      html: bodyEmail,
    };

  await this.transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
      if (error) {
        console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }

  async signUpMail(agentData: AgentModel){
    const bodyEmail = `<!DOCTYPE html>
    <html lang="en">
    <head>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td bgcolor="#ffffff" style="padding: 20px; text-align: center;">
            <h3 style="color: #333333;">Sign Up Confimation !</h3>
            <p style="color: #666666;">Congratulations ! Your new company registration is successfull.</p>
            <p style="color: #666666;">Looks ! <strong>Your account status is pending.</strong> Our Team will review your application.</p>
            <p style="color: #666666;">We will shortly let you know the decision.</p>
            <p style="color: #666666;">Thanks for joining ETrip Zone. </p>
            <p style="color: #666666;">Thank you, <br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Project OTA " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email,
      subject: "Sign Up - Confimation",
      html: bodyEmail
    };

  await this.transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
      if (error) {
        console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }

  async signUpDecisionMail(agentData: AgentModel){
    
    const bodyEmail = `<!DOCTYPE html>
    <html lang="en">
    <head>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td bgcolor="#ffffff" style="padding: 20px; text-align: center;">
            <h3 style="color: #333333;">Sign Up Decision !</h3>
            <p style="color: #666666;">After reviewing your application.</p>
            <p style="color: #666666;"><strong>Your account status is now ${agentData.status} .</strong></p>
            <p style="color: #666666;">Thanks for staying with ETrip Zone. </p>
            <p style="color: #666666;">Thank you, <br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Project OTA " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email,
      subject: "Sign Up - Confimation",
      html: bodyEmail
    };

    await this.transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
      if (error) {
        console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }

  async depositRequestApproved(depositData: DepositModel){

    const agentData = await   this.agentRepository.findOne({where: {agentId: depositData.agentId}})
    
    const bodyEmail = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                background: #ffffff;
                padding: 20px;
                margin: auto;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
                color: #444;
            }
            .info {
                background-color: #e9e9e9;
                padding: 10px;
                margin: 20px 0;
                border-left: 5px solid #333;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                padding: 10px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Payment Confirmation</h2>
            <p>Dear Customer, ${depositData.companyname}</p>
            <p>Your recent payment request has been processed successfully and credited to your agency balance.</p>
            <div class="info">
                <table>
                    <tr>
                        <th>Request Date</th>
                        <td>${depositData.created_at}</td>
                    </tr>
                    <tr>
                        <th>Top Up Amount</th>
                        <td>AED. ${depositData.amount}</td>
                    </tr>
                    <tr>
                        <th>Payment Type</th>
                        <td>${depositData.paymentway}</td>
                    </tr>
                    <tr>
                        <th>Deposited From</th>
                        <td>${depositData.receiver}.</td>
                    </tr>
                    <tr>
                        <th>Payment Reference</th>
                        <td>${depositData.ref}</td>
                    </tr>
                </table>
            </div>
            <p>Thank you for making the payment. If you have any questions or need further assistance, please don't hesitate to contact us.</p>
            <p>Best Regards,<br>
            <strong>eTripzone</strong></p>
        </div>
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Project OTA " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email,
      subject: "Deposit Request",
      html: bodyEmail
    };

    await this.transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
      if (error) {
        console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }

  async depositRequest(depositData: DepositModel, file){

    const agentData = await   this.agentRepository.findOne({where: {agentId: depositData.agentId}})
    const bodyEmail = `<!DOCTYPE html>
    <html lang="en">
    <head>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td bgcolor="#ffffff" style="padding: 20px; text-align: center;">
            <h3 style="color: #333333;">Despoit Request!</h3>
            <p style="color: #666666;"><strong>Your deposit request ${depositData.amount} AED.</strong></p>
            <p style="color: #666666;"><strong>Sender:  ${depositData.sender} AED.</strong></p>
            <p style="color: #666666;"><strong>Using ${depositData.paymentway} which Reference is ${depositData.ref} now ${depositData.status}</strong></p>
            <p style="color: #666666;">Thanks for staying with Keenan Travel. </p>
            <p style="color: #666666;">Thank you, <br/>${depositData.companyname}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Project OTA " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email,
      subject: "Deposit Request",
      html: bodyEmail,
      attachments: [
        {
            filename: file.originalname,
            content: file.buffer,
            contentType: file.mimetype
        }
    ]
    };

    await this.transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
      if (error) {
        console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }

  async depositRequestDecision(depositData: DepositModel){

    const agentData = await this.agentRepository.findOne({where: {agentId: depositData.agentId}})
    
    const bodyEmail = `<!DOCTYPE html>
    <html lang="en">
    <head>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td bgcolor="#ffffff" style="padding: 20px; text-align: center;">
            <h3 style="color: #333333;">Despoit Request!</h3>
            <p style="color: #666666;">After reviewing your request.</p>
            <p style="color: #666666;"><strong>Your deposit is now ${depositData.status} .</strong></p>
            <p style="color: #666666;"><strong>Your deposit amount ${depositData.status} AED.</strong></p>
            <p style="color: #666666;">Thanks for staying with Keenan Travel. </p>
            <p style="color: #666666;">Thank you, <br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Project OTA " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email,
      subject: "Desposit Confimation",
      html: bodyEmail,
    };

    await this.transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
      if (error) {
        console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }

  async depositBonus(depositBonus: AgentLedgerModel){

    const agentData = await this.agentRepository.findOne({where: {agentId: depositBonus.agentId}});
    
    const bodyEmail = `<!DOCTYPE html>
    <html lang="en">
    <head>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td bgcolor="#ffffff" style="padding: 20px; text-align: center;">
            <h3 style="color: #333333;">Despoit Bonus!</h3>
            <p style="color: #666666;">After reviewing your deposit request.</p>
            <p style="color: #666666;">We saw you meet our bonus policy.</p>
            <p style="color: #666666;"><strong>Your bonus amount ${depositBonus.credit} Added To your wallet.</strong></p>
            <p style="color: #666666;">Thanks for staying with eTrip Zone. </p>
            <p style="color: #666666;">Thank you, <br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Project OTA " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email, 
      subject: "Deposit Bonus",
      html: bodyEmail,
    };

    await this.transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
      if (error) {
        console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }

  async bookingConfirmation(bookingData: BookingModel) {

    const agentData = await this.agentRepository.findOne({where: {agentId: bookingData.agentId}});

    const bodyEmail = `<!DOCTYPE html>
    <html lang="en">
    <head>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td bgcolor="#ffffff" style="padding: 20px; text-align: center;">
            <h3 style="color: #333333;">Booking Confirmation !</h3>
            <p style="color: #666666;">Booking Refrence: ${bookingData.bookingId}</p>
            <p style="color: #666666;"><strong>Your account status is now ${bookingData.status} .</strong></p>
            <p style="color: #666666;">Thanks for staying with ETrip Zone. </p>
            <p style="color: #666666;">Thank you, <br/>${bookingData.companyname}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Project OTA " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email,
      subject: "Booking - Confimation",
      html: bodyEmail,
    };

    await this.transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
      if (error) {
        console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }

  async IssueRequestMail(bookingData: BookingModel) {
    const agentData = await this.agentRepository.findOne({where: {agentId: bookingData.agentId}});

    const bodyEmail = `<!DOCTYPE html>
    <html lang="en">
    <head>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td bgcolor="#ffffff" style="padding: 20px; text-align: center;">
            <h3 style="color: #333333;">Ticket Issue Request !</h3>
            <p style="color: #666666;">Booking Refrence: ${bookingData.bookingId}</p>
            <p style="color: #666666;"><strong>We are processing your ticket. wait for while</strong></p>
            <p style="color: #666666;">Thanks for staying with ETrip Zone. </p>
            <p style="color: #666666;">Thank you, <br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Project OTA " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email,
      subject: "Ticket Issue Request",
      html: bodyEmail,
    };

    await this.transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
      if (error) {
        console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }

  async IssueRequestRejectMail(bookingData: BookingModel) {
    const agentData = await this.agentRepository.findOne({where: {agentId: bookingData.agentId}});

    const bodyEmail = `<!DOCTYPE html>
    <html lang="en">
    <head>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td bgcolor="#ffffff" style="padding: 20px; text-align: center;">
            <h3 style="color: #333333;">Ticket Issue Request Rejected !</h3>
            <p style="color: #666666;">Booking Refrence: ${bookingData.bookingId}</p>
            <p style="color: #666666;"><strong>We are refunding your balance.</strong></p>
            <p style="color: #666666;">Thanks for staying with ETrip Zone. </p>
            <p style="color: #666666;">Thank you, <br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Project OTA " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email,
      subject: "Ticket Issue Rejected",
      html: bodyEmail,
    };

    await this.transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
      if (error) {
        console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }

  ticketedMail() {
    return 'This action adds a new mail';
  }

  async voidRequestMail(bookingData: BookingModel) {
    const agentData = await this.agentRepository.findOne({where: {agentId: bookingData.agentId}});
    const bodyEmail = `<!DOCTYPE html>
    <html lang="en">
    <head>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td bgcolor="#ffffff" style="padding: 20px; text-align: center;">
            <h3 style="color: #333333;">Void Requested !</h3>
            <p style="color: #666666;">Booking Refrence: ${bookingData.bookingId}</p>
            <p style="color: #666666;"><strong>Your Booking Void request is processing . Let us review</strong></p>
            <p style="color: #666666;">Thanks for staying with ETrip Zone. </p>
            <p style="color: #666666;">Thank you, <br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Project OTA " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email,
      subject: "Void Request",
      html: bodyEmail,
    };

    await this.transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
        if (error) {
          console.log('Error sending email: ', error);
        } else {
          console.log('Email sent: ', info.response);
        }
    });
  }

  async voidResultMail(bookingData: BookingModel) {
    const agentData = await this.agentRepository.findOne({where: {agentId: bookingData.agentId}});
    const bodyEmail = `<!DOCTYPE html>
    <html lang="en">
    <head>
    </head>
    <body style="font-family: Arial, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td bgcolor="#ffffff" style="padding: 20px; text-align: center;">
            <h3 style="color: #333333;">Void Request Confimation !</h3>
            <p style="color: #666666;">After reviewing your application.</p>
            <p style="color: #666666;"><strong>Your void request is ${bookingData.status} .</strong></p>
            <p style="color: #666666;"><strong>We added your voided amount in your walley .</strong></p>
            <p style="color: #666666;">Thanks for staying with ETrip Zone. </p>
            <p style="color: #666666;">Thank you, <br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Project OTA " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email,
      subject: "Void Request Decision",
      html: bodyEmail,
    };

    await this.transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
      if (error) {
        console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }

  async refundRequestMail() {
    return 'This action adds a new mail';
  }

  async refundQuotationMail() {
    return 'This action adds a new mail';
  }

  async refundQuotationDesicionMail() {
    return 'This action adds a new mail';
  }

  async refundQuotationResultMail() {
    return 'This action adds a new mail';
  }

  async reissueRequestMail() {
    return 'This action adds a new mail';
  }

  async reissueQuotationMail() {
    return 'This action adds a new mail';
  }

  async reissueQuotationDesicionMail() {
    return 'This action adds a new mail';
  }

  async reissueResultMail() {
    return 'This action adds a new mail';
  }
}

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
      from: "Keenan Travel " +`${process.env.EMAIL_USERNAME}`,
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

  async OTPSend2FA(email: string, OTPcode: string){
    const bodyEmail = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your OTP Code</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">

  <table width="100%" bgcolor="#f4f6f8" cellpadding="0" cellspacing="0" style="padding:30px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" bgcolor="#ffffff" cellpadding="0" cellspacing="0" style="border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.08); overflow:hidden;">
          <tr>
            <td align="center" bgcolor="#156534" style="padding: 20px;">
              <h1 style="margin:0; font-size:24px; color:#ffffff;">🔐 Two-Factor Authentication</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:30px; text-align:center; color:#333333;">
              <p style="font-size:16px; margin:0 0 15px;">Hello,</p>
              <p style="font-size:16px; margin:0 0 20px; color:#555555;">
                Use the One-Time Password (OTP) below to complete your login:
              </p>
              <div style="display:inline-block; padding:15px 30px; background:#156534; color:#ffffff; font-size:22px; font-weight:bold; letter-spacing:3px; border-radius:8px;">
                ${OTPcode}
              </div>
              <p style="font-size:14px; margin:25px 0 0; color:#777777;">
                This OTP will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td bgcolor="#f4f6f8" style="padding:20px; text-align:center; font-size:12px; color:#999999;">
              © ${new Date().getFullYear()} Keenan Travel. All rights reserved.
            </td>
          </tr>
        </table>
        <!-- End Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
    const mailOptions = {
      from: "Keenan Travel " +`${process.env.EMAIL_USERNAME}`,
      to: email,
      subject: "Login OTP",
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
      from: "Keenan Travel " +`${process.env.EMAIL_USERNAME}`,
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
      from: "Keenan Travel " +`${process.env.EMAIL_USERNAME}`,
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
            <p style="color: #666666;">Thanks for joining Keenan Travel. </p>
            <p style="color: #666666;">Thank you, <br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Keenan Travel " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email,
      cc: 'keenantraval@gmail.com',
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
            <p style="color: #666666;">Thanks for staying with Keenan Travel. </p>
            <p style="color: #666666;">Thank you, <br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Keenan Travel " +`${process.env.EMAIL_USERNAME}`,
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
                        <td> ${depositData.amount}</td>
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
      from: "Keenan Travel " +`${process.env.EMAIL_USERNAME}`,
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
            <p style="color: #666666;"><strong>Your deposit request ${depositData.amount}.</strong></p>
            <p style="color: #666666;"><strong>Sender:  ${depositData.sender}.</strong></p>
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
      from: "Keenan Travel " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email,
      cc: 'keenantraval@gmail.com',
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
            <p style="color: #666666;"><strong>Your deposit amount ${depositData.status}.</strong></p>
            <p style="color: #666666;">Thanks for staying with Keenan Travel. </p>
            <p style="color: #666666;">Thank you, <br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Keenan Travel " +`${process.env.EMAIL_USERNAME}`,
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
            <p style="color: #666666;">Thanks for staying with Keenan Travel. </p>
            <p style="color: #666666;">Thank you, <br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Keenan Travel " +`${process.env.EMAIL_USERNAME}`,
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
      <body style="font-family: Arial, sans-serif; background-color:#f7f7f7; margin:0; padding:0;">

        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          <tr>
            <td bgcolor="#2563eb" style="padding: 20px; text-align: center; color:#ffffff;">
              <h2 style="margin:0;">✈️ Booking Confirmation</h2>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 20px; text-align: left; color: #333333;">
              <p style="font-size:16px;">Booking Reference: <strong>${bookingData.bookingId}</strong></p>
              <p style="font-size:16px;">Airline: <strong>${bookingData.carrier_name}</strong></p>
              <p style="font-size:16px;">PNR: <strong>${bookingData.pnr}</strong></p>
              <p style="font-size:16px;">Route: <strong>${bookingData.depfrom} → ${bookingData.arrto}</strong></p>
              <p style="font-size:16px;">Departure Date: <strong>${bookingData.flightdate}</strong></p>
              <p style="font-size:16px;">Total Pax: <strong style="color:green;">${bookingData.totalpax}</strong></p>
              <p style="font-size:16px;">Status: <strong style="color:green;">${bookingData.status}</strong></p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 20px; text-align: left; color: #666666;">
              <p>Thank you for choosing <strong>Keenan Travel</strong>. We wish you a pleasant journey!</p>
              <p>Best regards, <br/>${bookingData.companyname}</p>
            </td>
          </tr>
          
          <tr>
            <td bgcolor="#f9f9f9" style="padding: 15px; text-align:center; font-size:12px; color:#888;">
              © 2025 ${bookingData.companyname}. All rights reserved.
            </td>
          </tr>
        </table>

      </body>
      </html>`;

    const mailOptions = {
      from: "Keenan Travel " +`${process.env.EMAIL_USERNAME}`,
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
  const agentData = await this.agentRepository.findOne({
    where: { agentId: bookingData.agentId },
  });

  const bodyEmail = `<!DOCTYPE html>
  <html lang="en">
  <head></head>
  <body style="font-family: Arial, sans-serif;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
      <tr>
        <td bgcolor="#ffffff" style="padding: 20px; text-align: center;">
          <h3 style="color: #333333;">Ticket Issue Request!</h3>
          <p style="color: #666666;">Booking Reference: ${bookingData.bookingId}</p>
          <p style="color: #666666;"><strong>We are processing your ticket. Please wait.</strong></p>
          <p style="color: #666666;">Thank you,<br/>${agentData?.company || "Keenan Travel"}</p>
        </td>
      </tr>
    </table>
  </body>
  </html>`;

  const toAdmin = process.env.ADMIN_NOTIFY_EMAIL || "keenantraval@gmail.com";
  
  const bccAgent = agentData?.email; // keep agent informed
const fromSender = process.env.MAIL_FROM || `Keenan Travel <${process.env.EMAIL_USERNAME}>`;

const mailOptions: any = {
  from: fromSender,
  to: "keenantraval@gmail.com", // ✅ Permanent admin email
  subject: `Ticket Issue Request - ${bookingData.bookingId}`,
  html: bodyEmail,
};

// keep agent copy
if (bccAgent) {
  mailOptions.bcc = bccAgent;
}

  // Use BCC instead of CC (better deliverability)
  if (bccAgent) mailOptions.bcc = bccAgent;

  // Logs so we can verify exactly where it's going
  console.log("[IssueRequestMail] FROM:", mailOptions.from);
  console.log("[IssueRequestMail] TO:", mailOptions.to);
  console.log("[IssueRequestMail] BCC:", mailOptions.bcc || "(none)");
  console.log("[IssueRequestMail] BOOKING:", bookingData.bookingId);

  await this.transporter.sendMail(mailOptions, (error: any, info: { response: any }) => {
    if (error) {
      console.log("[IssueRequestMail] Error sending email:", error);
    } else {
      console.log("[IssueRequestMail] Email sent:", info.response);
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
            <p style="color: #666666;">Thanks for staying with Keenan Travel. </p>
            <p style="color: #666666;">Thank you, <br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Keenan Travel " +`${process.env.EMAIL_USERNAME}`,
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
 // This mail is sent after the ticket is issued successfully to send the ticket details to the agent
  async ticketedMail(bookingData: BookingModel) {
  const agentData = await this.agentRepository.findOne({
    where: { agentId: bookingData.agentId },
  });

  // safety fallback (so it never crashes)
  const toEmail = agentData?.email || bookingData?.email;

  const bodyEmail = `<!DOCTYPE html>
  <html lang="en">
  <head></head>
  <body style="font-family: Arial, sans-serif;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
      <tr>
        <td bgcolor="#ffffff" style="padding: 20px; text-align: center;">
          <h3 style="color: #333333;">✅ Ticket Issued Successfully</h3>
          <p style="color: #666666;">Booking Reference: ${bookingData.bookingId}</p>
          <p style="color: #666666;">PNR: ${bookingData.airlinespnr || bookingData.pnr || '-'}</p>
          <p style="color: #666666;">Route: ${bookingData.depfrom}-${bookingData.arrto}</p>
          <p style="color: #666666;">Flight Date: ${bookingData.flightdate || '-'}</p>
          <p style="color: #666666;">Thank you,<br/>${bookingData.companyname || agentData?.company || 'Keenan Travel'}</p>
        </td>
      </tr>
    </table>
  </body>
  </html>`;

  const mailOptions = {
    from: "Keenan Travel " + `${process.env.EMAIL_USERNAME}`,
    to: toEmail,
    subject: "Ticket Issued Confirmation",
    html: bodyEmail,
  };

  await this.transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
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
            <p style="color: #666666;">Thanks for staying with Keenan Travel. </p>
            <p style="color: #666666;">Thank you, <br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Keenan Travel " +`${process.env.EMAIL_USERNAME}`,
      to: agentData.email,
      cc: 'keenantraval@gmail.com',
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
            <p style="color: #666666;">Thanks for staying with Keenan Travel. </p>
            <p style="color: #666666;">Thank you, <br/>${agentData.company}</p>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;
    const mailOptions = {
      from: "Keenan Travel " +`${process.env.EMAIL_USERNAME}`,
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

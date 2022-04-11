import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
require('dotenv').config();

@Injectable()
export class EmailService {
  async sendEMail(reciever: string, subject: string, text: string) {
    let transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Система Учета заявок IT-подразделения 👻" <${process.env.EMAIL_USER}>`, // sender address
      to: reciever, // list of receivers
      subject: subject, // Subject line
      html: text, // html body
    });
  }
}

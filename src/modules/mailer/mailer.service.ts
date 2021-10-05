import { Injectable } from '@nestjs/common';
import { ConfigService } from 'modules/config/config.service';
const Mailer = require('nodemailer');


@Injectable()
export class MailerService {
    constructor(
        private readonly configService:ConfigService,
      ) {}

    
    async sendMail(to: string, subject: string, body: string){

            return new Promise(async (resolve, reject) => {

                let transporter = Mailer.createTransport({
                  host: this.configService.SMTPHOST,
                  port: 587,
                  secure: false, // true for 465, false for other ports
                  auth: {
                    user: this.configService.SMTPEMAIL, // 
                    pass: this.configService.SMTPPASS, 
                  },
                });

                transporter.sendMail({
                    from: `"${this.configService.SMTPUSER}" <${this.configService.SMTPEMAIL}>`, // sender address
                    to: to, // list of receivers
                    subject: subject, // Subject line
                    text: body, // plain text body
                  }).then((x:any) => {
                      resolve(x);
                  }).catch((e : any) => {
                    reject(e);
                  })
            });
    }

    async sendMailHTML(to: string, subject: string, html: string){

        return new Promise(async (resolve, reject) => {

            let transporter = Mailer.createTransport({
              host: this.configService.SMTPHOST,
              port: 587,
              secure: false, // true for 465, false for other ports
              auth: {
                user: this.configService.SMTPEMAIL, // 
                pass: this.configService.SMTPPASS, 
              },
            });

            transporter.sendMail({
                from: `"${this.configService.SMTPUSER}" <${this.configService.SMTPEMAIL}>`, // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                html: html, // html body
              }).then((x:any) => {
                  resolve(x);
              }).catch((e : any) => {
                reject(e);
              })
        });
}

}

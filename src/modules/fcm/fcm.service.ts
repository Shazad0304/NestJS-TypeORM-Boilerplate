import { Injectable } from '@nestjs/common';
import { ConfigService } from 'modules/config/config.service';
const FCM = require('fcm-node');


@Injectable()
export class FCMService {
    constructor(
        private readonly configService:ConfigService,
      ) {}

    
    async SendNotification(fcmToken: string, title: string, body: string){
            const fcm = new FCM(this.configService.FCMACCESSKEY);

            return new Promise((resolve, reject) => {
                const message = {
                    to: fcmToken,
                    notification: {
                        title,
                        body,
                        sound: "default"
                    },
                    priority: "high"
                };
                fcm.send(message, (err : any, data : any) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
    }


    async SendData(fcmToken: string, data:any = {}){
        const fcm = new FCM(this.configService.FCMACCESSKEY);

        return new Promise((resolve, reject) => {
            const message = {
                to: fcmToken,
                data
            };
            fcm.send(message, (err : any, data : any) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

}

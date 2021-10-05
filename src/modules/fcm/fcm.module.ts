import { Module } from '@nestjs/common';
import { ConfigModule } from 'modules/config/config.module';
import { FCMService } from './fcm.service';


@Module({
  imports:[ConfigModule],
  providers: [FCMService],
  exports: [FCMService],
})
export class FCMModule {}

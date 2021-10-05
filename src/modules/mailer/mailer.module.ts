import { Module } from '@nestjs/common';
import { ConfigModule } from 'modules/config/config.module';
import { MailerService } from './mailer.service';

@Module({
  imports: [ConfigModule],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailModule {}
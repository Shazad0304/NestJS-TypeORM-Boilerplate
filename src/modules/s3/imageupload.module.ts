import { Module } from '@nestjs/common';
import { ConfigModule } from 'modules/config/config.module';
import { ImageUploadController } from './imageupload.controller';
import { ImageUploadService } from './imageupload.service';

@Module({
  imports : [ConfigModule],
  providers: [ImageUploadService],
  exports: [ImageUploadService],
  controllers: [ImageUploadController],
})
export class ImageUploadModule {}
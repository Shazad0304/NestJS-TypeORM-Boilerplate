import { Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ImageUploadService } from './imageupload.service';

@Controller('fileupload')
@ApiTags('fileupload')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}
  @Post()
  async create(@Req() request : any, @Res() response : any) {
    try {
      await this.imageUploadService.fileupload(request, response);
    } catch (error) {
        let err : any = error;
      return response
        .status(500)
        .json(`Failed to upload image file: ${err.message}`);
    }
  }
}
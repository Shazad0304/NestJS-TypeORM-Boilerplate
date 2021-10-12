import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { ConfigService } from 'modules/config/config.service';
import { Roles } from 'modules/common/decorators/roles.decorator';


@Injectable()
@Roles('admin') 
export class ImageUploadService {

  constructor(private readonly configService : ConfigService) {}

  async fileupload(@Req() req : any, @Res() res : any) {
    try {

      this.upload(req, res, function(error : any) {
        if (error) {
          console.log(error);
          return res.status(404).json(`Failed to upload image file: ${error}`);
        }
        return res.status(201).json(req.files[0].location);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(`Failed to upload image file: `);
   }
  }

  upload : any = multer({
    storage: multerS3({
      s3: new AWS.S3({
        accessKeyId: this.configService.AWSACCESS,
        secretAccessKey: this.configService.AWSSECRET,
      }),
      bucket: this.configService.AWSBUCKET,
      acl: 'public-read',
      key: function(request, file, cb) {
        cb(null, `uploads/${Date.now().toString()} - ${file.originalname}`);
      },
    }),
  }).array('upload', 1);
}
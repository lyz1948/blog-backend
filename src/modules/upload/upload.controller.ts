import {
  Controller,
  Get,
  Post,
  Param,
  Res,
  Body,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Upload } from './upload.model';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpProcessor } from '../../common/decorators/http.decorator';
import { PaginateResult } from 'mongoose';

const pngFileFilter = (req, file, callback) => {
  const ext = extname(file.originalname);
  console.log('ext', ext);
  if (ext !== '.png') {
    req.fileValidationError = 'Invalid file type';
    return callback(new Error('Invalid file type'), false);
  }

  return callback(null, true);
};

@Controller('upload')
export class UploadController {

  SERVER_URL: string = 'http://localhost:5381/';

  constructor(private readonly uploadService: UploadService) {}

  @Post('/files')
  @UseInterceptors(
    FilesInterceptor('files[]', 10, {
      fileFilter: pngFileFilter,
    }),
  )
  logFiles(@UploadedFiles() files, @Body() fileDto) {
    return 'Done';
  }

  @Get('/article/:fileId')
  getArticleImage(@Param('fileId') fileId, @Res() res) {
    res.sendFile(fileId, { root: 'uploads/article' });
  }

  @Get('/article')
  getAritcleImages(querys: string, options: any): Promise<PaginateResult<Upload>> {
    return this.uploadService.getImages(querys, options);
  }

  @HttpCode(200)
  @Post('/article')
  @HttpProcessor.handle({ message: '上传文章缩略图', usePaginate: false })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/article',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadAvatar(@UploadedFile() image) {
    const res = await this.uploadService.uploadImage(image);
    return res;
  }
}

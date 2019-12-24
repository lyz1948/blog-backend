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
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { extname } from 'path'
import { diskStorage } from 'multer'
import { PaginateResult } from 'mongoose'
import { Upload } from './upload.model'
import { UploadService } from './upload.service'
import { HttpProcessor } from '@app/common/decorators/http.decorator'
import { imageFileFilter, editFileName } from '@app/utils'

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

	// 批量图片上传
  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './uploads/files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  async uploadMultipleFiles(@UploadedFiles() files) {
    const response = []
    files.forEach(file => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      }
      response.push(fileReponse)
    })
    return response
  }

	// 批量文件上传
  @Post('/files')
  @UseInterceptors(
    FilesInterceptor('files[]', 10, {
      fileFilter: imageFileFilter,
    })
  )
  logFiles(@UploadedFiles() files, @Body() fileDto) {
    return 'Done'
  }

  @Get('/article/:fileId')
  getArticleImage(@Param('fileId') fileId, @Res() res) {
    res.sendFile(fileId, { root: 'uploads/article' })
  }

  @Get('/article')
  getAritcleImages(
    querys: string,
    options: any
  ): Promise<PaginateResult<Upload>> {
    return this.uploadService.getImages(querys, options)
  }

  @Get('/avatar/:fileId')
  async serveAvatar(@Param('fileId') fileId, @Res() res) {
    res.sendFile(fileId, { root: 'uploads' })
  }

	// 文章缩略图
  @Post('/article')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/article',
        filename: editFileName,
      }),
    })
  )
  async uploadArticleThumb(@UploadedFile() file) {
		const response = {
      originalname: file.originalname,
      filename: file.filename,
    }
		return response
  }

	// 头像上传
  @Post('/avatar')
  @HttpCode(200)
  @HttpProcessor.handle({ message: '上传头像', usePaginate: false })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          return cb(null, `${randomName}${extname(file.originalname)}`)
        },
      }),
    })
  )
  uploadAvatar(@UploadedFile() avatar) {
    return this.uploadService.uploadImage(avatar)
  }
}

import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { PaginateResult } from 'mongoose'
import { TMongooseModel } from '@app/common/interfaces/monoose.interface'
import { Upload } from './upload.model'

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Upload) private readonly uploadModel: TMongooseModel<Upload>
  ) {}

  async getImages(query, options): Promise<PaginateResult<Upload>> {
    return await this.uploadModel.paginate(query, options)
  }

  async getImage(fileId: string): Promise<Upload> {
    return await this.uploadModel.findById(fileId).exec()
  }

  async uploadImage(file: Upload): Promise<any> {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    }
    return await new this.uploadModel(response).save()
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PaginateResult } from 'mongoose';
import { Upload } from './upload.model';
import { TMongooseModel } from '../../common/interfaces/monoose.interface';
@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Upload) private readonly uploadModel: TMongooseModel<Upload>,
  ) {}

  async getImages(query, options): Promise<PaginateResult<Upload>> {
    const images = await this.uploadModel.paginate(query, options);
    return images;
  }

  async getImage(fileId: string): Promise<Upload> {
    const image = await this.uploadModel.findById(fileId).exec();
    return image;
  }

  async uploadImage(imageObj: Upload): Promise<Upload> {
    const { size, mimetype, destination, filename, path } = imageObj;
    const imgObj = { size, mimetype, destination, filename, path };
    console.log('size ', size / 1024 / 1024, 'mb');
    console.log('imgObj ', imgObj);
    return await new this.uploadModel(imgObj).save();
  }
}

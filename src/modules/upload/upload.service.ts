import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PaginateResult } from 'mongoose';
import { Upload } from './upload.model';
import { TMongooseModel } from '../../common/interfaces/monoose.interface';
import { readFileSync } from 'fs';

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

  async uploadImage(image: any): Promise<Upload> {
    const imageObj = new this.uploadModel();
    console.log(imageObj);
    const { data, contentType } = image;
    imageObj.data = data;
    imageObj.contentType = contentType;
    const res = await imageObj.save();
    return res;
    // return await new this.uploadModel().save();
  }
}

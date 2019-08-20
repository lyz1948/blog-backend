import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Tag } from './tag.model';
import { TMongooseModel } from '../../common/interfaces/monoose.interface';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag) private readonly tagModule: TMongooseModel<Tag>) {}

  async getTags(): Promise<Tag[]> {
    return await this.tagModule.find().exec();
  }

  async getTag(id): Promise<Tag> {
    return await this.tagModule.findById(id).exec();
  }

  async createTag(newTag: Tag): Promise<Tag> {
    console.log(typeof newTag);
    console.log(newTag);
    return await new this.tagModule(newTag).save();
  }

  async updateTag(tagId, tag: Tag): Promise<Tag> {
    return await this.tagModule.findByIdAndUpdate(tagId, tag);
  }

  async deleteTag(tagId): Promise<any> {
    return await this.tagModule.findByIdAndDelete(tagId);
  }
}

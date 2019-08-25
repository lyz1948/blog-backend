import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Category } from './category.model';
import { TMongooseModel } from '../../common/interfaces/monoose.interface';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category) private readonly categoryModule: TMongooseModel<Category>) {}

  async getCategories(): Promise<Category[]> {
    return await this.categoryModule.find().sort({ update_at: -1 }).exec();
  }

  async createCategory(newCate: Category): Promise<Category> {
    return await new this.categoryModule(newCate).save();
  }

  async updateCategory(cateId, newCate: Category): Promise<Category> {
    return await this.categoryModule.findByIdAndUpdate(cateId, newCate);
  }

  async deleteCategory(cateId): Promise<any> {
    return await this.categoryModule.findByIdAndRemove(cateId);
  }
}

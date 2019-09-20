import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { PaginateResult } from 'mongoose'
import { Category } from './category.model'
import { TMongooseModel } from '../../common/interfaces/monoose.interface'

@Injectable()
export class CategoryService {
	constructor(
		@InjectModel(Category)
		private readonly categoryModule: TMongooseModel<Category>
	) {}

	async findAll(query, options): Promise<PaginateResult<Category>> {
		return await this.categoryModule.paginate(query, options)
	}

	async create(newCate: Category): Promise<Category> {
		return await new this.categoryModule(newCate).save()
	}

	async update(cateId, newCate: Category): Promise<Category> {
		return await this.categoryModule.findByIdAndUpdate(cateId, newCate)
	}

	async delete(cateId): Promise<any> {
		return await this.categoryModule.findByIdAndRemove(cateId)
	}
}

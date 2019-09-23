import { Injectable } from '@nestjs/common'
import { PaginateResult } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { TMongooseModel } from '@app/common/interfaces/monoose.interface'
import { Tag } from './tag.model'

@Injectable()
export class TagService {
	constructor(
		@InjectModel(Tag) private readonly tagModule: TMongooseModel<Tag>
	) {}

	async findAll(query, options): Promise<PaginateResult<Tag>> {
		return await this.tagModule.paginate(query, options)
	}

	async findOne(id): Promise<Tag> {
		return await this.tagModule.findById(id).exec()
	}

	async create(newTag: Tag): Promise<Tag> {
		return await new this.tagModule(newTag).save()
	}

	async update(tagId, tag: Tag): Promise<Tag> {
		return await this.tagModule.findByIdAndUpdate(tagId, tag, { new: true })
	}

	async delete(tagId): Promise<any> {
		return await this.tagModule.findByIdAndDelete(tagId)
	}
}

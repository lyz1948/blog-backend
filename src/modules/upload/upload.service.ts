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

	async uploadImage(image: Upload): Promise<any> {
		const imageObj = await new this.uploadModel(image).save()
		return imageObj.path
	}
}

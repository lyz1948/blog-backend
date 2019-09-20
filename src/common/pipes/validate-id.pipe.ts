import {
	PipeTransform,
	ArgumentMetadata,
	BadRequestException,
} from '@nestjs/common'
import * as mongoose from 'mongoose'

export class ValidateObjectId implements PipeTransform {
	async transform(value: any, metadata: ArgumentMetadata) {
		const isValid = mongoose.Types.ObjectId.isValid(value)
		if (!isValid) {
			throw new BadRequestException('Invalid id')
		}
		return value
	}
}

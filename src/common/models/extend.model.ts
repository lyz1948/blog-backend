import { prop } from 'typegoose'
import { IsString, IsNotEmpty } from 'class-validator'

export class Extend {
	@IsNotEmpty()
	@IsString()
	@prop({ required: true, validate: /\S+/ })
	name: string

	@IsNotEmpty()
	@IsString()
	@prop({ required: true, validate: /\S+/ })
	value: string
}

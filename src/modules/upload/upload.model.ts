import { Types } from 'mongoose'
import { Typegoose, pre, plugin, prop, arrayProp } from 'typegoose'
import {
	mongoosePaginate,
	mongooseAutoIncrement,
} from '../../common/transforms/mongoose.transform'
import { Extend } from '../../common/models/extend.model'
import {
	IsNotEmpty,
	IsString,
	IsArray,
	ArrayUnique,
	IsInt,
	Max,
} from 'class-validator'

@pre<Upload>('findOneAndUpdate', function(next) {
	this.findOneAndUpdate({}, { update_at: Date.now() })
	next()
})
@plugin(mongoosePaginate)
@plugin(mongooseAutoIncrement.plugin, {
	model: Upload.name,
	field: 'id',
	startAt: 1,
	incrementBy: 1,
})
export class Upload extends Typegoose {
	@IsNotEmpty({ message: '标签名称不能少啊！' })
	@IsString({ message: '标签名称不是字符串！' })
	@prop({ required: true, validate: /\S+/ })
	filename: string

	@IsNotEmpty({ message: '标签别名不能少啊！' })
	@IsString({ message: '标签别名不是字符串！' })
	@prop({ required: true, validate: /\S+/ })
	path: string

	@IsInt()
	@Max(2097152)
	@prop()
	size?: number

	@prop({ default: Date.now })
	create_at?: Date

	@prop({ default: Date.now })
	update_at?: Date

	@IsArray()
	@ArrayUnique()
	@arrayProp({ items: Extend })
	extends?: Extend
}

const UploadModelConfig = {
	typegooseClass: Upload,
	schemaOptions: {
		toObject: { getters: true },
		toJSON: {
			virtuals: true,
			versionKey: false,
			transform: (doc, ret, options) => {
				delete ret._id
				delete ret.__v
				delete ret.id
				return ret
			},
		},
		timestamps: true,
	},
}

export default UploadModelConfig

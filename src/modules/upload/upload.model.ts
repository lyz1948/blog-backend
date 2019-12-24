import { Typegoose, pre, plugin, prop, arrayProp } from 'typegoose'
import {
	IsString,
} from 'class-validator'
import {
	mongoosePaginate,
	mongooseAutoIncrement,
} from '@app/common/transforms/mongoose.transform'

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
	originalname: string

	filename: string

	@prop({ default: Date.now })
	create_at?: Date

	@prop({ default: Date.now })
	update_at?: Date
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

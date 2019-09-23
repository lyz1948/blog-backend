import { Typegoose, pre, plugin, prop, arrayProp } from 'typegoose'
import {
	mongoosePaginate,
	mongooseAutoIncrement,
} from '@app/common/transforms/mongoose.transform'
import {
	IsNotEmpty,
	IsString,
	IsArray,
	ArrayUnique,
	IsInt,
	IsDefined,
} from 'class-validator'

// 元信息
class Meta {
	@IsInt()
	@prop({ default: 0 })
	vote: number
}

// 黑名单
export class Blacklist {
	@IsArray()
	@ArrayUnique()
	@arrayProp({ items: String })
	ips: string[]

	@IsArray()
	@ArrayUnique()
	@arrayProp({ items: String })
	mails: string[]

	@IsArray()
	@ArrayUnique()
	@arrayProp({ items: String })
	keywords: string[]
}

@pre<Site>('findOneAndUpdate', function(next) {
	this.findOneAndUpdate({}, { update_at: Date.now() })
	next()
})

export class Site extends Typegoose {
	@IsNotEmpty({ message: '站点名称不能少啊！' })
	@IsString({ message: '站点名称不是字符串！' })
	@prop({ required: true, validate: /\S+/ })
	title: string

	@IsNotEmpty({ message: '站点名称不能少啊！' })
	@IsString({ message: '站点名称不是字符串！' })
	@prop({ required: true, validate: /\S+/ })
	sub_title: string

	@IsArray()
	@ArrayUnique()
	@arrayProp({ items: String })
	keywords: string[]

	@IsString()
	@prop()
	description?: string

	@IsString()
	@prop({ required: true })
	domain: string

	@IsString()
	@prop({ required: true })
	email: string

	@IsString()
	@prop({ required: true })
	icp: string

	@prop()
	blacklist?: Blacklist

	@prop()
	meta?: Meta

	@prop({ default: Date.now })
	create_at?: Date

	@prop({ default: Date.now })
	update_at?: Date
}

const SiteModelConfig = {
	typegooseClass: Site,
	schemaOptions: {
		toObject: { getters: true },
		toJSON: {
			virtuals: true,
			versionKey: false,
			transform: (doc, ret, options) => {
				// delete ret._id;
				delete ret.__v
				delete ret.id
				return ret
			},
		},
		timestamps: true,
	},
}

export default SiteModelConfig

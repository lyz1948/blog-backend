import { Types } from 'mongoose'
import { pre, prop, plugin, arrayProp, Typegoose } from 'typegoose'
import { IsString, IsNotEmpty, IsArray, ArrayUnique } from 'class-validator'
import { Extend } from '@app/common/models/extend.model'
import {
	mongoosePaginate,
	mongooseAutoIncrement,
} from '@app/common/transforms/mongoose.transform'

@pre<Category>('findOneAndUpdate', function(next) {
	this.findOneAndUpdate({}, { update_at: Date.now() })
	next()
})
@plugin(mongoosePaginate)
@plugin(mongooseAutoIncrement.plugin, {
	model: Category.name, // schema的名字
	field: 'id',
	startAt: 1,
	incrementBy: 1,
})
export class Category extends Typegoose {
	@IsNotEmpty({ message: '分类名称不能少啊！' })
	@IsString({ message: '分类标题不是字符串格式！ ' })
	@prop({ required: true, validate: /\S+/ })
	name: string

	@IsNotEmpty({ message: '分类的别名不能少啊！' })
	@IsString({ message: '别名不是字符串格式！' })
	@prop({ required: true, validate: /\S+/ })
	slug: string

	@IsString({ message: '分类描述不是字符串格式！' })
	@prop()
	description: string

	@prop({ ref: Category, default: null })
	pid: Types.ObjectId

	@prop({ default: Date.now })
	create_at?: Date

	@prop({ default: Date.now })
	update_at?: Date

	@IsArray()
	@ArrayUnique()
	@arrayProp({ items: Extend })
	extends?: Extend[]
}

const CategoryModelConfig = {
	typegooseClass: Category,
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

export default CategoryModelConfig

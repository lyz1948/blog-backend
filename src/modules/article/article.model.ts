import { prop, arrayProp, plugin, pre, Typegoose, Ref } from 'typegoose'
import {
	IsString,
	IsNotEmpty,
	IsArray,
	IsDefined,
	IsIn,
	IsInt,
	ArrayUnique,
} from 'class-validator'
import {
	mongoosePaginate,
	mongooseAutoIncrement,
} from '@app/common/transforms/mongoose.transform'
import {
	EStateOrigin,
	EStatePublic,
	EStatePublish,
} from '@app/common/interfaces/state.interface'
import { Extend } from '@app/common/models/extend.model'
import { Category } from '@app/modules/category/category.model'
import { Tag } from '@app/modules/tag/tag.model'
import * as CONFIG from '@app/app.config'

// 元信息
export class Meta {
	@IsInt()
	@prop({ default: 0 })
	likes: number

	@IsInt()
	@prop({ default: 0 })
	views: number

	@IsInt()
	@prop({ default: 0 })
	comments: number
}

@pre<Article>('findOneAndUpdate', function(next) {
	this.findOneAndUpdate({}, { update_at: Date.now() })
	next()
})
@plugin(mongoosePaginate)
@plugin(mongooseAutoIncrement.plugin, {
	model: Article.name,
	field: 'id',
	startAt: 1,
	incrementBy: 1,
})
export class Article extends Typegoose {
	@IsNotEmpty({ message: '文章标题？' })
	@IsString({ message: '标题字符串？' })
	@prop({ required: true, validate: /\S+/ })
	title: string

	@IsNotEmpty({ message: '文章内容？' })
	@IsString({ message: '内容字符串？' })
	@prop({ required: true, validate: /\S+/ })
	content: string

	// 列表时用的文章内容虚拟属性
	@prop()
	get t_content() {
		const content = this.content
		return content ? content.substring(0, 130) : content
	}

	@IsString({ message: '描述字符串？' })
	@prop()
	description: string

	@IsString({ message: '作者字符串？' })
	@prop({ default: CONFIG.ARTICLE.author })
	author: string

	// 缩略图
	@IsString({ message: '缩略图字符串？' })
	@prop({ default: CONFIG.ARTICLE.thumb })
	thumb: string

	// 文章密码 -> 密码状态生效
	@IsString({ message: '密码字符串？' })
	@prop({ default: '' })
	password: string

	// 文章关键字（SEO）
	@IsArray()
	@ArrayUnique()
	@arrayProp({ items: String })
	keywords: string[]

	// 文章发布状态
	@IsDefined()
	@IsIn([EStatePublish.Draft, EStatePublish.Published, EStatePublish.Recycle])
	@IsInt({ message: '状态不匹配！' })
	@prop({ default: EStatePublish.Published })
	state: EStatePublish

	// 文章公开方式
	@IsDefined()
	@IsIn([EStatePublic.Password, EStatePublic.Public, EStatePublic.Secret])
	@IsInt({ message: '状态不匹配！' })
	@prop({ default: EStatePublic.Public })
	public: EStatePublic

	@IsDefined()
	@IsIn([EStateOrigin.Original, EStateOrigin.Reprint, EStateOrigin.Hybrid])
	@IsInt({ message: '状态不匹配！' })
	@prop({ default: EStateOrigin.Original })
	origin: EStateOrigin

	// 其他元信息
	@prop()
	meta: Meta

	// 文章标签
	@arrayProp({ itemsRef: Tag })
	tag: Ref<Tag>[]

	// 文章分类
	@arrayProp({ itemsRef: Category, required: true })
	category: Ref<Category>[]

	// 发布日期
	@prop({ default: Date.now })
	create_at?: Date

	// 最后修改日期
	@prop({ default: Date.now })
	update_at?: Date

	@IsArray()
	@ArrayUnique()
	@arrayProp({ items: Extend })
	extends?: Extend[]

	// 相关文章
	related?: Article[]
}

const ArticleModelConfig = {
	typegooseClass: Article,
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

export default ArticleModelConfig

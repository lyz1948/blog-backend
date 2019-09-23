import { prop, plugin, pre, Typegoose } from 'typegoose'
import { IsDefined, IsString, IsNotEmpty } from 'class-validator'
import {
	mongoosePaginate,
	mongooseAutoIncrement,
} from '@app/common/transforms/mongoose.transform'

@pre<User>('findOneAndUpdate', function(next) {
	this.findOneAndUpdate({}, { update_at: Date.now() })
	next()
})
@plugin(mongoosePaginate)
@plugin(mongooseAutoIncrement.plugin, {
	model: User.name,
	field: 'id',
	startAt: 1,
	incrementBy: 1,
})
export class User extends Typegoose {
	@IsDefined()
	@IsString({ message: '用户名？' })
	@prop({ default: 'visit' })
	username: string

	@IsDefined()
	@IsString({ message: '口头禅？' })
	@prop({ default: '' })
	slogan: string

	@IsDefined()
	@IsString({ message: '头像？' })
	@prop({
		default: 'https://avatars1.githubusercontent.com/u/15190827?s=460&v=4',
	})
	avatar: string

	@IsDefined()
	@IsString({ message: '密码？' })
	@prop({ default: 'root' })
	password?: string

	_id?: string
	password_new?: string
	password_new_rep?: string
}

export class UserLogin extends Typegoose {
	@IsDefined()
	@IsNotEmpty({ message: '用户名？' })
	@IsString({ message: '字符串？' })
	name: string

	@IsDefined()
	@IsNotEmpty({ message: '密码？' })
	@IsString({ message: '字符串？' })
	password: string
}

const UserModelConfig = {
	typegooseClass: User,
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

export default UserModelConfig

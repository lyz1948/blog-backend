import { prop, Typegoose } from 'typegoose';
import { IsDefined, IsString, IsNotEmpty } from 'class-validator';

export class User extends Typegoose {
  @IsDefined()
  @IsString({ message: '用户名？' })
  @prop({ default: 'visit' })
  name: string;

  @IsDefined()
  @IsString({ message: '口头禅？' })
  @prop({ default: '' })
  slogan: string;

  @IsDefined()
  @IsString({ message: '头像？' })
  @prop({ default: 'https://avatars1.githubusercontent.com/u/15190827?s=460&v=4' })
  avatar: string;

  password?: string;
  new_password?: string;
  rel_new_password?: string;
}

export class UserLogin extends Typegoose {
  @IsDefined()
  @IsNotEmpty({ message: '密码？' })
  @IsString({ message: '字符串？' })
  password: string;
}

const UserModelConfig = {
  typegooseClass: User,
  schemaOptions: {
    toObject: { getters: true },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret, options) => {
        delete ret._id;
        delete ret.__v;
        delete ret.id;
        return ret;
      },
    },
    timestamps: true,
  },
};

export default UserModelConfig;
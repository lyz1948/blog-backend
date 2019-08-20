import { Types } from 'mongoose';
import { plugin, prop, pre, Typegoose } from 'typegoose';
import { IsString, IsNotEmpty, IsInt, Max } from 'class-validator';
import {
  mongoosePaginate,
  mongooseAutoIncrement,
} from '../../common/transforms/mongoose.transform';

@pre<Upload>('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
})
@plugin(mongoosePaginate)
@plugin(mongooseAutoIncrement.plugin, {
  model: Upload.name,
  field: 'id',
  startAt: 1,
  incrementBy: 1,
})
export class Upload extends Typegoose {

  @IsNotEmpty({ message: '文件类型?' })
  data: Buffer;

  // @IsNotEmpty({ message: '存放目录?' })
  // @IsString({ message: '字符串?' })
  // destination: string;

  // @IsNotEmpty({ message: '文件名称?' })
  // @IsString({ message: '字符串?' })
  // name: string;

  @IsNotEmpty({ message: '图片类型？' })
  @IsString({ message: '字符串' })
  contentType: string;

  // @IsInt({ message: '数字类型?' })
  // @Max(8192)
  // size: number;

  @prop({ default: Date.now })
  create_at?: Date;

  @prop({ default: Date.now })
  update_at?: Date;
}

const UploadModelConfig = {
  typegooseClass: Upload,
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

export default UploadModelConfig;

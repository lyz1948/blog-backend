import { plugin, pre, Typegoose } from 'typegoose';
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
  @IsNotEmpty()
  @IsString({ message: '类型？' })
  mimetype: string;

  @IsNotEmpty()
  @IsString({ message: '存放目录？' })
  destination: string;

  @IsNotEmpty()
  @IsString({ message: '文件名？' })
  filename: string;

  @IsNotEmpty()
  @IsString({ message: '路径？' })
  path: string;

  @IsInt()
  @Max(8192)
  size: number;
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

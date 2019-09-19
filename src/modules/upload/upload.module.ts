import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { Upload } from './upload.model';
@Module({
  imports: [TypegooseModule.forFeature([Upload])],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}

import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import Tag from './tag.model';

@Module({
  imports: [
    TypegooseModule.forFeature([Tag]),
  ],
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}

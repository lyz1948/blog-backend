import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import Category from './category.model'

@Module({
	imports: [TypegooseModule.forFeature([Category])],
	providers: [CategoryService],
	controllers: [CategoryController],
	exports: [CategoryService],
})
export class CategoryModule {}

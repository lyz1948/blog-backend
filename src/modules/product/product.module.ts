import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { ProductService } from './product.service'
import Product from './product.schema'
import { ProductController } from './product.controller'
@Module({
	imports: [TypegooseModule.forFeature([Product])],
	controllers: [ProductController],
	providers: [ProductService],
})
export class ProductModule {}

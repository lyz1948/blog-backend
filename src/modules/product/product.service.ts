import { InjectModel } from 'nestjs-typegoose'
import { Injectable } from '@nestjs/common'
import { ModelType } from 'typegoose'
import { Product } from './product.schema'

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(Product)
		private readonly productModel: ModelType<Product>
	) {}

	async getProducts(): Promise<Product[]> {
		return await this.productModel.find().exec()
	}

	async createProduct(product: Product): Promise<Product> {
		return await new this.productModel(product).save()
	}
}

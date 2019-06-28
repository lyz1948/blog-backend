import { Controller, Get, Body, HttpException, Res, HttpStatus, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.schema';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts(): Promise<Product[]> {
    return this.productService.getProducts();
  }

  @Post()
  async createProduct(@Res() res, @Body() product: Product): Promise<Product> {
    const data = await this.productService.createProduct(product);
    if (!data) {
      // DO NOTHING
    }
    return res.status(HttpStatus.OK).json(data);
  }
}

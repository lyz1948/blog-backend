import { Controller, Get, Post, Body, Delete, Put, Res, Param, HttpStatus, NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.model';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories(): Promise<Category[]> {
    return await this.categoryService.getCategories();
  }

  @Post()
  async createCategory(@Res() res, @Body() newCate: Category): Promise<Category> {
    const cate = await this.categoryService.createCategory(newCate);
    if (!cate) {
      throw new NotFoundException('Article not found!');
    }
    return res.status(HttpStatus.OK).json(cate);
  }

  @Put('/:id')
  async updateCategory(@Res() res, @Param('id') id, @Body() newCate: Category): Promise<Category> {
    return await this.categoryService.updateCategory(id, newCate);
  }

  @Delete('/:id')
  async deleteCategory(@Param('id') id): Promise<Category> {
    return await this.categoryService.deleteCategory(id);
  }
}

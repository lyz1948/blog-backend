import { Controller, Get, Post, Body, Delete, Put, Res, Param, HttpStatus, NotFoundException } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { CategoryService } from './category.service';
import { Category } from './category.model';
import { QueryDecorator } from '../../common/decorators/query.decorator';
import { HttpProcessor } from '../../common/decorators/http.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @HttpProcessor.paginate()
  @HttpProcessor.handle('获取文章分类')
  async getCategories(
    @QueryDecorator() { query, options, origin, isAuthenticated },
    ): Promise<PaginateResult<Category>> {
    return await this.categoryService.findAll(query, options);
  }

  @Post()
  async createCategory(@Res() res, @Body() newCate: Category): Promise<Category> {
    const cate = await this.categoryService.create(newCate);
    if (!cate) {
      throw new NotFoundException('Article not found!');
    }
    return res.status(HttpStatus.OK).json(cate);
  }

  @Put('/:id')
  async updateCategory(@Res() res, @Param('id') id, @Body() newCate: Category): Promise<Category> {
    return await this.categoryService.update(id, newCate);
  }

  @Delete('/:id')
  async deleteCategory(@Param('id') id): Promise<Category> {
    return await this.categoryService.delete(id);
  }
}

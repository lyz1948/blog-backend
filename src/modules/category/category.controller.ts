import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Res,
  Param,
  HttpStatus,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
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
  async getCategories(@QueryDecorator()
  {
    query,
    options,
    origin,
    isAuthenticated,
  }): Promise<PaginateResult<Category>> {
    return await this.categoryService.findAll(query, options);
  }

  @Post()
  @HttpCode(200)
  @HttpProcessor.handle('添加文章分类')
  async createCategory(
    @Body() newCate: Category,
  ): Promise<Category> {
    return await this.categoryService.create(newCate);
  }

  @Put('/:id')
  @HttpProcessor.handle('更新文章分类')
  async updateCategory(
    @Res() res,
    @Param('id') id,
    @Body() newCate: Category,
  ): Promise<Category> {
    return await this.categoryService.update(id, newCate);
  }

  @Delete('/:id')
  @HttpProcessor.handle('删除文章分类')
  async deleteCategory(@Param('id') id): Promise<Category> {
    return await this.categoryService.delete(id);
  }
}

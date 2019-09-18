import {
  Controller,
  Get,
  Res,
  Param,
  NotFoundException,
  HttpStatus,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.model';
import { HttpProcessor } from '../../common/decorators/http.decorator';
import { PaginateResult } from 'mongoose';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { HumanizedAuthorGuard } from '../../common/guards/humanizedAuth.guard';
import {
  QueryDecorator,
  EQueryOptionField as QueryParams,
} from '../../common/decorators/query.decorator';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @HttpProcessor.paginate()
  @HttpProcessor.handle('获取文章列表')
  getArticles(@QueryDecorator()
  {
    query,
    options,
    origin,
    isAuthenticated,
  }): Promise<PaginateResult<Article>> {
    return this.articleService.getArticles(query, options);
  }

  @Get('/:id')
  @HttpProcessor.handle({ message: '获取文章详情', usePaginate: false })
  getArticle(@Param('id') id): Promise<Article> {
    return this.articleService.findOne(id);
  }

  @Post()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle({ message: '添加文章', usePaginate: false })
  async createArticle(@Body() newArticle: any): Promise<Article> {
    return await this.articleService.create(newArticle);
  }

  @Put('/:id')
  @HttpProcessor.handle({ message: '更新文章', usePaginate: false })
  async updateArticle(@Param('id') id, @Body() newArticle: any) {
    return await this.articleService.update(id, newArticle);
  }

  @Delete('/:id')
  @HttpProcessor.handle({ message: '删除文章', usePaginate: false})
  async deleteArticle(@Param('id') id) {
    await this.articleService.deleteArticle(id);
    return id;
  }
}

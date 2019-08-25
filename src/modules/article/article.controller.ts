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
import { QueryDecorator, EQueryOptionField as QueryParams } from '../../common/decorators/query.decorator';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  // @UseGuards(HumanizedAuthorGuard)
  @HttpProcessor.paginate()
  @HttpProcessor.handle('获取文章')
  getArticles(querys: string, options: any): Promise<PaginateResult<Article>> {
    return this.articleService.getArticles(querys, options);
  }

  @Get('/:id')
  getArticle(
    @Param('id') id,
  ): Promise<Article> {
    return this.articleService.getArticle(id);
  }

  @Post()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle({ message: '添加文章', usePaginate: false })
  async addArticle(@Body() newArticle: Article): Promise<Article> {
    const article = await this.articleService.createArticle(newArticle);
    return article;
  }

  @Put()
  async editArticle(
    @Res() res,
    @Param('id') id,
    @Body() newArticle: Article,
  ) {
    const article = await this.articleService.updateArticle(id, newArticle);
    return article;
  }

  @Delete('/:id')
  @HttpProcessor.handle('删除文章')
  async deleteArticle(@Param('id') id) {
    await this.articleService.deleteArticle(id);
    return id;
  }
}

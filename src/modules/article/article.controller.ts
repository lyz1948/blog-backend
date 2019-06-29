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
  HttpCode,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.model';
import { HttpProcessor } from '../../common/decorators/http.decorator';
import { PaginateResult } from 'mongoose';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { HumanizedAuthorGuard } from '../../common/guards/HumanizedAuth.guard';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @UseGuards(HumanizedAuthorGuard)
  @HttpProcessor.paginate()
  @HttpProcessor.handle('获取文章')
  getArticles(querys: string, options: any, origin, isAuthorized): Promise<PaginateResult<Article>> {
    return this.articleService.getArticles(querys, options);
  }

  @Get('/:id')
  getArticle(
    @Param('id') id,
  ): Promise<Article> {
    return this.articleService.getArticle(id);
  }

  @Post()
  @HttpProcessor.handle('添加文章')
  async addArticle(@Res() res, @Body() newArticle: Article): Promise<Article> {
    const article = await this.articleService.addArticle(newArticle);
    if (!article) {
      throw new NotFoundException('Article not found!');
    }
    return res.status(HttpStatus.OK).json(article);
  }

  @Put()
  async editArticle(
    @Res() res,
    @Param('id') id,
    @Body() newArticle: Article,
  ) {
    const article = await this.articleService.updateArticle(id, newArticle);
    if (!article) {
      throw new NotFoundException('Article does not exsit!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Article has been successfully updated!',
      article,
    });
  }

  @Delete()
  async deleteArticle(@Res() res, @Param('id') id) {
    const article = await this.articleService.deleteArticle(id);
    if (!article) {
      throw new NotFoundException('Article does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Article has been deleted!',
      article,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TMongooseModel } from '../../common/interfaces/monoose.interface';
import { Article } from './article.model';
import { PaginateResult } from 'mongoose';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article)
    private readonly articleModel: TMongooseModel<Article>,
  ) {}

  async getArticles(query, options): Promise<PaginateResult<Article>> {
    const articles = await this.articleModel.paginate(query, options);
    return articles;
  }

  async getArticle(articleId): Promise<Article> {
    const article = await this.articleModel.findById(articleId).exec();
    return article;
  }

  async addArticle(newArticle: Article): Promise<Article> {
    newArticle = Object.assign(
      { meta: { likes: 0, views: 0, comments: 0 } },
      newArticle,
    );
    const article = await new this.articleModel(newArticle).save();
    return article;
  }

  async updateArticle(articleId, newArticle: Article): Promise<Article> {
    const editedArticle = await this.articleModel.findByIdAndUpdate(
      articleId,
      newArticle,
      { new: true },
    );
    return editedArticle;
  }

  async deleteArticle(articleId): Promise<any> {
    const deletedArticle = await this.articleModel.findByIdAndRemove(articleId);
    return deletedArticle;
  }
}

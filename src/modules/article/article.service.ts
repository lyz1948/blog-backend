import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TMongooseModel } from '../../common/interfaces/monoose.interface';
import { Article } from './article.model';
import { PaginateResult } from 'mongoose';
import * as CONFIG from '../../app.config';

const qiniu = require('qiniu');
const nanoid = require('nanoid');

const bucket = CONFIG.QINIU.bucket;

const mac = new qiniu.auth.digest.Mac(CONFIG.QINIU.ak, CONFIG.QINIU.sk);
const cfg = new qiniu.conf.Config();
const client = new qiniu.rs.BucketManager(mac, cfg);

const uploadToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
    client.fetch(url, bucket, key, (err, res, info) => {
      if (err) {
        reject(err);
      } else {
        if (info.statusCode === 200) {
          resolve({ key });
        } else {
          reject(info);
        }
      }
    });
  });
};

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
    console.log(article);
    return article;
  }

  async createArticle(newArticle: Article): Promise<Article> {
    const thumburl = await uploadToQiniu(newArticle.thumb, nanoid() + '.png');
    newArticle = Object.assign(
      { meta: { likes: 0, views: 0, comments: 0 }, thumb: thumburl },
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

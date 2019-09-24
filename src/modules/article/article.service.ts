import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { TMongooseModel } from '@app/common/interfaces/monoose.interface'
import { Article } from './article.model'
import { PaginateResult } from 'mongoose'

// import * as CONFIG from '@app/config';
// const qiniu = require('qiniu');
// const nanoid = require('nanoid');

// const bucket = CONFIG.QINIU.bucket;

// const mac = new qiniu.auth.digest.Mac(CONFIG.QINIU.ak, CONFIG.QINIU.sk);
// const cfg = new qiniu.conf.Config();
// const client = new qiniu.rs.BucketManager(mac, cfg);

// const uploadToQiniu = async (url, key) => {
//   return new Promise((resolve, reject) => {
//     client.fetch(url, bucket, key, (err, res, info) => {
//       if (err) {
//         reject(err);
//       } else {
//         if (info.statusCode === 200) {
//           resolve({ key });
//         } else {
//           reject(info);
//         }
//       }
//     });
//   });
// };

@Injectable()
export class ArticleService {
	constructor(
		@InjectModel(Article)
		private readonly articleModel: TMongooseModel<Article>
	) {}

	async getArticles(querys, options): Promise<PaginateResult<Article>> {
		options.populate = ['category', 'tag']
		options.select = '-password'
		return await this.articleModel.paginate(querys, options)
	}

	async findById(id: Article): Promise<Article> {
		return await this.articleModel.findById(id).exec()
	}

	async findAll(): Promise<PaginateResult<Article>> {
		return await this.articleModel.paginate()
	}

	async findOne(_id: Article): Promise<Article> {
		const article = await this.articleModel
			.findOne({ _id })
			.populate({ path: 'tag' })
			.populate({ path: 'category' })
			.exec()
		return article
	}

	async create(newArticle: Article): Promise<Article> {
		// const thumburl = await uploadToQiniu(newArticle.thumb, nanoid() + '.png');
		newArticle = Object.assign(
			{ meta: { likes: 0, views: 0, comments: 0 } },
			newArticle
		)
		return await new this.articleModel(newArticle).save()
	}

	async update(articleId, newArticle: Article): Promise<Article> {
		const editedArticle = await this.articleModel.findByIdAndUpdate(
			articleId,
			newArticle,
			{ new: true }
		)
		return editedArticle
	}

	async deleteArticle(articleId): Promise<any> {
		return await this.articleModel.findByIdAndRemove(articleId)
	}
}

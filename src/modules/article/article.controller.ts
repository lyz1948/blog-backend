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
} from '@nestjs/common'
import * as lodash from 'lodash'
import { ArticleService } from './article.service'
import { Article } from './article.model'
import { HttpProcessor } from '@app/common/decorators/http.decorator'
import { PaginateResult } from 'mongoose'
import { JwtAuthGuard } from '@app/common/guards/auth.guard'
import { HumanizedAuthorGuard } from '@app/common/guards/humanizedAuth.guard'
import {
	QueryDecorator,
	EQueryOptionField as QueryParams,
} from '@app/common/decorators/query.decorator'
import { EStateSortType } from '@app/common/interfaces/state.interface'

@Controller('article')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@Get()
	@HttpProcessor.paginate()
	@HttpProcessor.handle('获取文章列表')
	getArticles(@QueryDecorator([
		QueryParams.Date, 
		// QueryParams.State, QueryParams.Public, QueryParams.Origin,
    'cache', 'tag', 'category', 'tag_slug', 'category_slug',
	])
	{
		querys,
		options,
		origin,
		isAuthenticated,
	}): Promise<PaginateResult<Article>> {

		if (Number(origin.sort) === EStateSortType.Hot) {
			console.log('请求热门文章')
		}

		if (!isAuthenticated && querys.cache) {
			console.log('从缓存获取');
		}

		// 关键字搜索
		const keyword = lodash.trim(origin.keyword)
		if (keyword) {
			const reKeyword = new RegExp(keyword, 'i')
			querys.$or = [
				{ name: reKeyword },
				{ content: reKeyword },
				{ description: reKeyword },
			]
		}

		return this.articleService.getArticles(querys, options)
	}

	@Get('/:id')
	@HttpProcessor.handle({ message: '获取文章详情', usePaginate: false })
	getArticle(@Param('id') id): Promise<Article> {
		return this.articleService.findOne(id)
	}

	@Post()
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@HttpProcessor.handle({ message: '添加文章', usePaginate: false })
	async createArticle(@Body() newArticle: any): Promise<Article> {
		return await this.articleService.create(newArticle)
	}

	@Put('/:id')
	@HttpProcessor.handle({ message: '更新文章', usePaginate: false })
	async updateArticle(@Param('id') id, @Body() newArticle: any) {
		return await this.articleService.update(id, newArticle)
	}

	@Delete('/:id')
	@HttpProcessor.handle({ message: '删除文章', usePaginate: false })
	async deleteArticle(@Param('id') id) {
		await this.articleService.deleteArticle(id)
		return id
	}
}

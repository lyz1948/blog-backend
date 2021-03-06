import {
	Controller,
	Get,
	Post,
	Body,
	Put,
	Delete,
	Param,
	HttpCode,
} from '@nestjs/common'
import { PaginateResult } from 'mongoose'
import { Tag } from './tag.model'
import { TagService } from './tag.service'
import { HttpProcessor } from '@app/common/decorators/http.decorator'
import { QueryDecorator } from '@app/common/decorators/query.decorator'
import * as lodash from 'lodash'

@Controller('tag')
export class TagController {
	constructor(private readonly tagService: TagService) {}

	@Get()
	@HttpProcessor.paginate()
	@HttpProcessor.handle('获取文章标签')
	async getTags(@QueryDecorator()
	{
		querys,
		options,
		origin,
		isAuthenticated,
	}): Promise<PaginateResult<Tag>> {
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
		return await this.tagService.findAll(querys, options)
	}

	@Get('/:id')
	async getTag(@Param('id') id): Promise<Tag> {
		return await this.tagService.findOne(id)
	}

	@Post()
	@HttpCode(200)
	@HttpProcessor.handle({ message: '添加标签', usePaginate: false })
	async createTag(@Body() newTag: Tag): Promise<Tag> {
		return await this.tagService.create(newTag)
	}

	@Put('/:id')
	async updateTag(@Param('id') id, @Body() newTag: Tag): Promise<Tag> {
		return await this.tagService.update(id, newTag)
	}

	@Delete('/:id')
	@HttpProcessor.handle({ message: '删除标签', usePaginate: false })
	async deleteTag(@Param('id') id): Promise<any> {
		return await this.tagService.delete(id)
	}
}

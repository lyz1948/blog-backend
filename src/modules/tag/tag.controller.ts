import { Controller, Get, Post, Body, Put, Delete, Param, HttpCode } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './tag.model';
import { HttpProcessor } from '../../common/decorators/http.decorator';
import { QueryDecorator } from '../../common/decorators/query.decorator';
import { PaginateResult } from 'mongoose';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @HttpProcessor.paginate()
  @HttpProcessor.handle('获取文章标签')
  async getTags(
    @QueryDecorator() { query, options, origin, isAuthenticated },
  ): Promise<PaginateResult<Tag>> {
    console.log('=====');
    console.log(query, options);
    return await this.tagService.getTags(query, options);
  }

  @Get('/:id')
  async getTag(@Param('id') id): Promise<Tag> {
    return await this.tagService.getTag(id);
  }

  @Post()
  @HttpCode(200)
  @HttpProcessor.handle({ message: '添加标签', usePaginate: false })
  async createTag(@Body() newTag: Tag): Promise<Tag> {
    const tag = await this.tagService.createTag(newTag);
    return tag;
  }

  @Put('/:id')
  async updateTag(@Param('id') id, @Body() newTag: Tag): Promise<Tag> {
    const tag = await this.tagService.updateTag(id, newTag);
    return tag;
  }

  @Delete('/:id')
  @HttpProcessor.handle({ message: '删除标签', usePaginate: false })
  async deleteTag(@Param('id') id): Promise<any> {
    return await this.tagService.deleteTag(id);
  }
}

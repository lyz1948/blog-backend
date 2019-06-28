import { Controller, Get, Post, Res, Body, Put, Delete, Param, HttpStatus, NotFoundException } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './tag.model';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getTags(): Promise<Tag[]> {
    return await this.tagService.getTags();
  }

  @Get('/:id')
  async getTag(@Param('id') id): Promise<Tag> {
    return await this.tagService.getTag(id);
  }

  @Post()
  async createTag(@Res() res, @Body() newTag: Tag): Promise<Tag> {
    const tag = await this.tagService.createTag(newTag);
    if (!tag) {
      throw new NotFoundException('Article not found!');
    }
    return res.status(HttpStatus.OK).json(tag);
  }

  @Put('/:id')
  async updateTag(@Param('id') id, newTag: Tag): Promise<Tag> {
    return await this.tagService.updateTag(id, newTag);
  }

  @Delete('/:id')
  async deleteTag(@Param('id') id): Promise<any> {
    return await this.tagService.deleteTag(id);
  }
}

import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common'
import { HttpProcessor } from '@app/common/decorators/http.decorator'
import { JwtAuthGuard } from '@app/common/guards/auth.guard'
import { SiteService } from './site.service'
import { Site } from './site.model'

@Controller('site')
export class SiteController {
	constructor(private readonly siteService: SiteService) {}

	@Get()
  @HttpProcessor.handle('获取站点设置')
	getSiteOption(): Promise<Site> {
		return this.siteService.getSite()
	}

  @Put()
  @HttpProcessor.handle('修改站点设置')
  // @UseGuards(JwtAuthGuard)
	setSiteOption(@Body() siteOption: Site): Promise<Site> {
		console.log('co', siteOption)

		return this.siteService.setSite(siteOption)
	}
}

import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { TMongooseModel } from '@app/common/interfaces/monoose.interface'
import { Site } from './site.model'

@Injectable()
export class SiteService {
	constructor(
		@InjectModel(Site) private readonly siteModule: TMongooseModel<Site>
	) {}

	async getSite(): Promise<Site> {
		return await this.siteModule.findOne().exec()
	}

	async setSite(siteOption: Site): Promise<Site> {
		Reflect.deleteProperty(siteOption, '_id')
		Reflect.deleteProperty(siteOption, 'vote')

		console.log('fdsa', siteOption)

		const siteConfig = await this.siteModule.findOne().exec()
		return siteConfig
			? Object.assign(siteConfig, siteOption).save()
			: new this.siteModule(siteOption).save()
	}
}

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
    console.log('siteOption: ', siteOption);
    Reflect.deleteProperty(siteOption, '_id')
    Reflect.deleteProperty(siteOption, 'vote')

    const siteConfig = await this.siteModule
      .findOne(null, '_id title sub_title description email domain icp blacklist keywords')
      .exec()
    if (siteConfig) {
      const mergeObj = Object.assign(siteConfig, siteOption)
      console.log('mergeObj: ', mergeObj)
      return mergeObj.save()
    }
    return new this.siteModule(siteOption).save()
    // return siteConfig
    //   ? (Object.assign(siteConfig, siteOption)).save()
    //   : new this.siteModule(siteOption).save()
  }
}

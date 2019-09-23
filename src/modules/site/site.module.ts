import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { SiteService } from './site.service'
import { SiteController } from './site.controller'
import Site from './site.model'

@Module({
	imports: [TypegooseModule.forFeature([Site])],
	providers: [SiteService],
	controllers: [SiteController],
	exports: [SiteService],
})
export class SiteModule {}

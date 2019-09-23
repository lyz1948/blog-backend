import { AppService } from './app.service'
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { CorsMiddleware } from './common/middleware/cros.middleware'
import { DatabaseModule } from './common/database/database.module'
import { ArticleModule } from './modules/article/article.module'
import { CategoryModule } from './modules/category/category.module'
import { UserModule } from './modules/user/user.module'
import { TagModule } from './modules/tag/tag.module'
import { UploadModule } from './modules/upload/upload.module'
import { AppController } from './app.controller'
import { SiteModule } from './modules/site/site.module'
import * as CONFIG from './config'

@Module({
	imports: [
		TypegooseModule.forRoot(CONFIG.MONGO.uri),
		DatabaseModule,
		ArticleModule,
		CategoryModule,
		TagModule,
		UserModule,
		UploadModule,
		SiteModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CorsMiddleware).forRoutes('*')
	}
}

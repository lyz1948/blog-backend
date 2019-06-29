import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { DatabaseModule } from './common/database/database.module';
import { ProductModule } from './modules/product/product.module';
import { ArticleModule } from './modules/article/article.module';
import { CategoryModule } from './modules/category/category.module';
import { UserModule } from './modules/user/user.module';
import { TagModule } from './modules/tag/tag.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as CONFIG from './app.config';
import { CorsMiddleware } from './common/middleware/cros.middleware'
@Module({
  imports: [
    TypegooseModule.forRoot(CONFIG.MONGO.uri),
    DatabaseModule,
    ArticleModule,
    CategoryModule,
    TagModule,
    UserModule,
    // ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}

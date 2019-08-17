import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { DatabaseModule } from './common/database/database.module';
import { ProductModule } from './modules/product/product.module';
import { ArticleModule } from './modules/article/article.module';
import { CategoryModule } from './modules/category/category.module';
import { UserModule } from './modules/user/user.module';
import { TagModule } from './modules/tag/tag.module';
import { UploadModule } from './modules/upload/upload.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CorsMiddleware } from './common/middleware/cros.middleware';
// import { MulterModule } from '@nestjs/platform-express';
import * as CONFIG from './app.config';

@Module({
  imports: [
    TypegooseModule.forRoot(CONFIG.MONGO.uri),
    // MulterModule.register({
    //   dest: './uploads',
    // }),
    DatabaseModule,
    ArticleModule,
    CategoryModule,
    TagModule,
    UserModule,
    UploadModule,
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

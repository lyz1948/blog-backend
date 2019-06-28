import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProductModule } from './modules/product/product.module';
import { ArticleModule } from './modules/article/article.module';
import { CategoryModule } from './modules/category/category.module';
import { TagModule } from './modules/tag/tag.module';
import * as CONFIG from './app.config';
import { DatabaseModule } from './common/database/database.module';

@Module({
  imports: [
    TypegooseModule.forRoot(CONFIG.MONGO.uri),
    DatabaseModule,
    ProductModule,
    ArticleModule,
    CategoryModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

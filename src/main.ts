import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as CONFIG from './app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(CONFIG.APP.port);
}
bootstrap();

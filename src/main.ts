import { NestFactory, Reflector } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from '@app/app.module'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from '@app/common/filters/error.filter'
import { LoggingInterceptor } from '@app/common/interceptors/logger.interceptor'
import { TransformInterceptor } from '@app/common/interceptors/transform.interceptor'
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor'
import * as CONFIG from '@app/config'
import * as BodyParser from 'body-parser'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors()
  app.setGlobalPrefix('api')
  app.use(BodyParser.urlencoded({ extended: true }))
  app.use(BodyParser.json())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages: CONFIG.APP.dev ? true : false,
    })
  )
  app.useGlobalFilters(new HttpExceptionFilter())

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ErrorInterceptor(new Reflector()),
    new TransformInterceptor(new Reflector())
  )

  app.useStaticAssets(join(__dirname, '..'))

  // swagger
  // const options = new DocumentBuilder()
  //   .setTitle('YKPINE')
  //   .setDescription('lyz个人博客项目API')
  //   .setVersion('1.0')
  //   .setBasePath('api')
  //   // .addTag('blog')
  //   .addBearerAuth()
  //   .build()

  // const document = SwaggerModule.createDocument(app, options)
  // SwaggerModule.setup('api', app, document)
  await app.listen(CONFIG.APP.port)
}

bootstrap().then(() => {
  console.log(
    `service is runing at port ${CONFIG.APP.port} env ${CONFIG.APP.env}`
  )
})

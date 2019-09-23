import { NestFactory, Reflector } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './common/filters/error.filter'
import { LoggingInterceptor } from './common/interceptors/logger.interceptor'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { ErrorInterceptor } from './common/interceptors/error.interceptor'
import * as CONFIG from './config'
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
	await app.listen(CONFIG.APP.port)
}
bootstrap().then(() => {
	console.log(
		`service is runing at port ${CONFIG.APP.port} env ${CONFIG.APP.env}`
	)
})

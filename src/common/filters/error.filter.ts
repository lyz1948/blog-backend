import * as lodash from 'lodash'
import { isDevMode } from '../../app.environment'
import {
	EHttpStatus,
	THttpErrorResponse,
	TExceptionOption,
	TMessage,
} from '../interfaces/http.interface'
import { HttpStatus } from '@nestjs/common'

import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const request = ctx.getRequest<Request>()
		const status = exception.getStatus()

		const errorOption: TExceptionOption = exception.getResponse() as TExceptionOption
		const isString = (value): value is TMessage => lodash.isString(value)
		const errMessage = isString(errorOption) ? errorOption : errorOption.message
		const errorInfo = isString(errorOption) ? null : errorOption.error
		const parentErrorInfo = errorInfo ? String(errorInfo) : null
		const isChildrenError = errorInfo && errorInfo.status && errorInfo.message
		const resultError =
			(isChildrenError && errorInfo.message) || parentErrorInfo
		const resultStatus = isChildrenError ? errorInfo.status : status
		const data: THttpErrorResponse = {
			status: EHttpStatus.Error,
			message: errMessage,
			error: resultError,
			debug: isDevMode ? exception.stack : null,
		}

		// 对默认的 404 进行特殊处理
		if (status === HttpStatus.NOT_FOUND) {
			data.error = `资源不存在`
			data.message = `接口 ${request.method} -> ${request.url} 无效`
		}
		return response.status(resultStatus).json(data)
		// response
		//   .status(status)
		//   .json({
		//     statusCode: status,
		//     timestamp: new Date().toISOString(),
		//     path: request.url,
		//   });
	}
}

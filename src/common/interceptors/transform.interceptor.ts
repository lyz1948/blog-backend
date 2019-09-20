import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import * as TEXT from '../constants/text.constant'
import * as META from '../constants/meta.constant'
import { PaginateResult } from 'mongoose'
import {
	EHttpStatus,
	IHttpResultPaginate,
	THttpSuccessResponse,
} from '../interfaces/http.interface'

export function transformDataToPaginate<T>(
	data: PaginateResult<T>,
	request: any
): IHttpResultPaginate<T[]> {
	return {
		data: data.docs,
		params: request ? request.queryParams : null,
		pagination: {
			total: data.total,
			current_page: data.page,
			total_page: data.pages,
			per_page: data.limit,
		},
	}
}

@Injectable()
export class TransformInterceptor<T>
	implements NestInterceptor<T, THttpSuccessResponse<T>> {
	constructor(private readonly reflector: Reflector) {}
	intercept(
		context: ExecutionContext,
		next: CallHandler
	): Observable<THttpSuccessResponse<T>> {
		const target = context.getHandler()
		const request = context.switchToHttp().getRequest()
		const message =
			this.reflector.get<string>(META.HTTP_SUCCESS_MESSAGE, target) ||
			TEXT.HTTP_DEFAULT_SUCCESS_TXT
		const usePaginate = this.reflector.get<boolean>(
			META.HTTP_RES_TRANSFORM_PAGENATE,
			target
		)

		return next.handle().pipe(
			map((data: any) => {
				const result = !usePaginate
					? data
					: transformDataToPaginate<T>(data, request)
				return { status: EHttpStatus.Success, message, result }
			})
		)
	}
}

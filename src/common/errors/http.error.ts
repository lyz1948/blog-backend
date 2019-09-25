import { Injectable, UnauthorizedException } from '@nestjs/common'
import { TMessage } from '@app/common/interfaces/http.interface'
import * as TEXT from '@app/common/constants/text.constant'

@Injectable()
export class HttpUnauthorizeError extends UnauthorizedException {
	constructor(message?: TMessage, error?: any) {
		super(message || TEXT.HTTP_UNAUTHORIZED_TEXT_DEFAULT, error)
	}
}

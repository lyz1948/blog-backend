import { AuthGuard } from '@nestjs/passport'
import { Injectable, ExecutionContext } from '@nestjs/common'
import { HttpUnauthorizeError } from '../errors/http.error'

@Injectable()
export class HumanizedAuthorGuard extends AuthGuard('jwt') {
	canActivate(context: ExecutionContext) {
		return super.canActivate(context)
	}

	handleRequest(err, user, info) {
		const passToken = !!user
		const failToken = !user && err && info.message === 'No auth token'

		if (!err && (passToken || failToken)) {
			return user
		} else {
			throw err || new HttpUnauthorizeError(null, info && info.message)
		}
	}
}

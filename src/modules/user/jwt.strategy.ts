import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from './user.service'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as CONFIG from '../../app.config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly userService: UserService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: CONFIG.USER.jwtTokenSecret,
		})
	}

	async validate(payload: any) {
		const user = await this.userService.validateUser(payload)
		if (user) {
			return user
		} else {
			throw new UnauthorizedException()
		}
	}
}

import {
	Controller,
	Get,
	Post,
	Body,
	HttpCode,
	Put,
	UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { ITokenResult } from './user.interface'
import { User } from './user.model'
import { HttpProcessor } from '@app/common/decorators/http.decorator'
import { JwtAuthGuard } from '@app/common/guards/auth.guard'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	getUsers(): Promise<User[]> {
		return this.userService.findAll()
	}

	@Get('/admin')
	@HttpProcessor.handle('获取管理员信息')
	getUser(): Promise<User> {
		return this.userService.getUserInfo()
	}

	@Post('/signup')
	@HttpProcessor.handle('用户注册')
	@HttpCode(200)
	signUp(@Body() user: User): Promise<any> {
		console.log('user:', user)
		return this.userService.signUp(user)
	}

	@Post('/signin')
	@HttpCode(200)
	@HttpProcessor.handle('用户登录')
	signIn(@Body() user: User): Promise<ITokenResult> {
		return this.userService.signIn(user)
	}

	@Put('/profile')
	@HttpCode(200)
	@HttpProcessor.handle('更新管理员信息')
	updateUserInfo(@Body() user: any): Promise<any> {
		return this.userService.update(user)
	}
}

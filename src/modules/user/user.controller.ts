import {
	Controller,
	Get,
	Res,
	Post,
	Body,
	Param,
	UseInterceptors,
	UploadedFile,
	HttpCode,
	Put,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { extname } from 'path'
import { diskStorage } from 'multer'
import { UserService } from './user.service'
import { ITokenResult } from './user.interface'
import { User, UserLogin } from './user.model'
import { HttpProcessor } from '@app/common/decorators/http.decorator'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
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
	signUp(@Body() user: any): Promise<User> {
		return this.userService.signUp(user)
	}

	@Post('/signin')
	@HttpCode(200)
	@HttpProcessor.handle('用户登录')
	signIn(@Body() user: UserLogin): Promise<ITokenResult> {
		return this.userService.signIn(user)
	}

	@Put('/profile')
	@HttpCode(200)
	@HttpProcessor.handle('更新管理员信息')
	updateUserInfo(@Body() user: any): Promise<User> {
		return this.userService.update(user)
	}
}

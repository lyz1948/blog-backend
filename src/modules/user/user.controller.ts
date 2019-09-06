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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { ITokenResult } from './user.interface';
import { User, UserLogin } from './user.model';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpProcessor } from '../../common/decorators/http.decorator';
import { HttpUnauthorizeError } from '../../common/errors/http.error';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('/admin')
  @HttpProcessor.handle('管理员登录')
  async getUser(): Promise<User> {
    return await this.userService.getUserInfo();
  }

  @Post('/signup')
  // @HttpCode(200)
  signUp(@Body() user: User) {
    console.log('controller', user);
    return this.userService.signUp(user);
  }

  @Post('/signin')
  @HttpCode(200)
  async signIn(@Body() user: UserLogin): Promise<ITokenResult> {
    const res = await this.userService.signIn(user);
    return res;
  }

  @Put('/profile')
  @HttpCode(200)
  async updateUserInfo(@Body() info: User): Promise<User> {
    const userInfo = await this.userService.update(info);
    if (!userInfo) {
      throw new HttpUnauthorizeError('旧密码校验错误', HttpStatus.BAD_REQUEST);
    }
    return userInfo;
  }

  @Get('avatar/:fileId')
  async serveAvatar(@Param('fileId') fileId, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: 'uploads' });
  }

  @Post('/avatar/:userid')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadAvatar(@Param('userid') userId, @UploadedFile() avatar) {
    this.userService.setAvatar(userId, `${avatar.path}`);
  }
}

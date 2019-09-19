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
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/admin')
  @HttpProcessor.handle('管理员登录')
  getUser(): Promise<User> {
    return this.userService.getUserInfo();
  }

  @Post('/signup')
  @HttpProcessor.handle('用户注册')
  @HttpCode(200)
  signUp(@Body() user: any): Promise<User> {
    return this.userService.signUp(user);
  }

  @Post('/signin')
  @HttpCode(200)
  @HttpProcessor.handle('用户登录')
  signIn(@Body() user: UserLogin): Promise<ITokenResult> {
    return this.userService.signIn(user);
  }

  @Put('/profile')
  @HttpCode(200)
  @HttpProcessor.handle('更新管理员信息')
  updateUserInfo(@Body() user: any): Promise<User> {
    return this.userService.update(user);
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

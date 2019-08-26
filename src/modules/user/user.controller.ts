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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { ITokenResult } from './user.interface';
import { User, UserLogin } from './user.model';
import { HttpProcessor } from '../../common/decorators/http.decorator';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('user')
export class UserController {
  SERVER_URL: string = 'http://localhost:5381/';

  constructor(private readonly userService: UserService) {}

  @Get('/admin')
  @HttpProcessor.handle('管理员登录')
  getAdminInfo(): Promise<User> {
    return this.userService.getAdminInfo();
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @Get('/:id')
  async getUser(@Param('id') id): Promise<User[]> {
    return await this.userService.getUser(id);
  }

  @Post('/signup')
  @HttpCode(200)
  async signUp(@Body() user: User): Promise<User> {
    return await this.userService.signUp(user);
  }

  @Post('/login')
  @HttpCode(200)
  async createToken(@Body() user: UserLogin): Promise<ITokenResult> {
    const token = await this.userService.signIn(user.password);
    return token;
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
    this.userService.setAvatar(userId, `${this.SERVER_URL}${avatar.path}`);
  }
}

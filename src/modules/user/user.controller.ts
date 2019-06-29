import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ITokenResult } from './user.interface';
import { User, UserLogin } from './user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/admin')
  getAdminInfo(): Promise<User> {
    return this.userService.getAdminInfo();
  }

  @Get('/users')
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @Post('/signup')
  async signUp(@Body() user: User): Promise<User> {
    return this.userService.signUp(user);
  }

  @Post('/login')
  async createToken(@Body() user: UserLogin): Promise<ITokenResult> {
    const token = await this.userService.createToken(user.password);
    console.log(token);
    return token;
  }
}

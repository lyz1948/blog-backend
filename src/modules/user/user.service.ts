import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import * as lodash from 'lodash';
import { Base64 } from 'js-base64';
import { User, UserLogin } from './user.model';
import { ITokenResult } from './user.interface';
import { TMongooseModel } from '../../common/interfaces/monoose.interface';
import * as CONFIG from '../../app.config';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: TMongooseModel<User>,
    private readonly jwtService: JwtService,
  ) {}

  private makeMD5(password) {
    return createHash('md5')
      .update(password)
      .digest('hex');
  }

  private makeBase64(password) {
    return password ? Base64.encode(password) : password;
  }

  private decodeBase64(password) {
    return password ? Base64.decode(password) : password;
  }

  // 获取密码
  private getExistPassword(user: User): string {
    if (user) {
      return user.password || this.makeMD5(CONFIG.USER.defaultPwd as string);
    }
  }

  // 校验token
  async validateUser(payload: any): Promise<any> {
    const isVerify = lodash.isEqual(payload.data, CONFIG.USER.data);
    return isVerify ? payload.data : null;
  }

  private createToken(): Promise<ITokenResult> {
    const userToken = this.jwtService.sign({
      data: CONFIG.USER.data,
    });
    return Promise.resolve({
      access_token: userToken,
      expires_in: CONFIG.USER.expiresIn as number,
    });
  }

  // 更新头像
  async setAvatar(userId: string, avatarUrl: string) {
    await this.userModel.update({ _id: userId }, { avatar: avatarUrl });
  }

  // 查找所有用户
  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  // 查找单个用户
  async findOne(options: object): Promise<User> {
    return await this.userModel.findOne(options).exec();
  }

  // id查找用户
  async findById(id: number): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  // 创建用户
  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return await createdUser.save();
  }

  // 更新用户信息
  async update(newUser: User): Promise<User> {
    const { _id } = newUser;
    const user = await this.userModel.findById(_id).exec();
    // 比对密码
    if (this.decodeBase64(user.password) === newUser.password) {
      newUser.password_new = this.makeMD5(
        this.decodeBase64(newUser.password_new),
      );
      await this.userModel.findByIdAndUpdate(_id, newUser).exec();
      return await this.userModel.findById(_id).exec();
    }
  }

  // 删除用户
  async delete(id: string): Promise<string> {
    try {
      await this.userModel.findByIdAndRemove(id).exec();
      return 'The user has been deleted';
    } catch (err) {
      return 'The user could not be deleted';
    }
  }

  // 获取用户信息
  async getUserInfo(): Promise<User> {
    const userInfo = await this.userModel
      .findOne(null, '-_id username slogan avatar')
      .exec();
    return userInfo;
  }

  // 注册
  async signUp(user: User) {
    const { password } = user;
    user = Object.assign(user, { password: this.makeMD5(password) });
    const newUser = await new this.userModel(user).save();
    return newUser;
  }

  /**
   * 创建token
   * @param user 用户信息
   */
  async signIn(userInfo: any): Promise<ITokenResult> {
    const { username, password } = userInfo;
    const user = await this.userModel.findOne({username}).exec();

    const existPwd = this.getExistPassword(user);
    const submittedPwd = this.makeMD5(this.decodeBase64(password));

    if (existPwd === submittedPwd) {
      // 对比密码是否相同
      return Promise.resolve(this.createToken());
    }
    return Promise.reject('用户名或密码错误');
  }
}

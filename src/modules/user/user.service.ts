import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import * as lodash from 'lodash';
import { Base64 } from 'js-base64';
import { createHash } from 'crypto';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './user.model';
import { ITokenResult } from './user.interface';
import { TMongooseModel } from '../../common/interfaces/monoose.interface';
import * as CONFIG from '../../app.config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: TMongooseModel<User>,
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

  async getUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async getAdminInfo(): Promise<User> {
    const adminInfo = await this.userModel
      .findOne(null, '-_id name slogan avatar')
      .exec();
    return adminInfo;
  }

  async validateUser(payload: any): Promise<any> {
    const isVerify = lodash.isEqual(payload.data, CONFIG.USER.data);
    return isVerify ? payload.data : null;
  }

  async signUp(user): Promise<User> {
    const { password } = user;
    user = Object.assign(user, { password: Base64.encode(password) });
    const newUser = await new this.userModel(user).save();
    return newUser;
  }

  async createToken(password: string): Promise<ITokenResult> {
    const user = await this.userModel.findOne(null, 'password').exec();
    const extantuserPwd = user && user.password;
    const extantPassword =
      extantuserPwd || this.makeMD5(CONFIG.USER.defaultPwd);
    const submittedPassword = this.makeMD5(password);

    console.log('数据库密码', extantPassword, '用户密码', submittedPassword);
    // 对比密码是否相同
    if (extantPassword === submittedPassword) {
      const userToken = this.jwtService.sign({
        data: CONFIG.USER.data,
      });
      return Promise.resolve({
        access_token: userToken,
        expires_in: CONFIG.USER.expiresIn as number,
      });
    }
    return Promise.reject('用户名或密码不正确');
  }
}

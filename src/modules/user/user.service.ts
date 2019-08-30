import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { Base64 } from 'js-base64';
import { User } from './user.model';
import { ITokenResult } from './user.interface';
import { TMongooseModel } from '../../common/interfaces/monoose.interface';
import { HttpUnauthorizeError } from '../../common/errors/http.error';
import * as lodash from 'lodash';
import * as CONFIG from '../../app.config';
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

  async setAvatar(userId: string, avatarUrl: string) {
    await this.userModel.update({ _id: userId }, { avatar: avatarUrl });
  }

  async getUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async getUser(id: string): Promise<User> {
    return await this.userModel.findOne({ _id: id }).exec();
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

  async updateUserInfo(userInfo: User): Promise<User> {
    const { _id, password } = userInfo;
    const userOld = await this.userModel.findOne({ password }).exec();

    if (userOld) {
      userInfo.password = userInfo.password_new;
      delete userInfo.password_new;

      const userNew = await this.userModel.findOneAndUpdate(_id, userInfo, { new: true });
      return userNew;
    }
  }

  async signIn(password: string): Promise<ITokenResult> {
    const user = await this.userModel.findOne(null, 'password').exec();
    const userInfo = await this.getUser(user._id);
    const { name, avatar, slogan, _id } = userInfo as User;

    const extantuserPwd = user && user.password;
    const extantPassword =
      extantuserPwd || this.makeMD5(CONFIG.USER.defaultPwd);
    const submittedPassword = this.makeMD5(this.decodeBase64(password));

    // 对比密码是否相同
    if (extantPassword === submittedPassword) {
      const userToken = this.jwtService.sign({
        data: CONFIG.USER.data,
      });
      return Promise.resolve({
        access_token: userToken,
        expires_in: CONFIG.USER.expiresIn as number,
        _id,
        name,
        avatar,
        slogan,
      });
    }
    return Promise.reject({ message: '用户名或密码不正确' });
  }
}

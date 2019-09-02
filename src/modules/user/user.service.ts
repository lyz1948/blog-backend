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
  /**
   * 校验token
   * @param payload 校验的数据
   */
  async validateUser(payload: any): Promise<any> {
    const isVerify = lodash.isEqual(payload.data, CONFIG.USER.data);
    return isVerify ? payload.data : null;
  }

  /**
   * 更新头像
   * @param userId 用户Id
   * @param avatarUrl 更新头像地址
   */
  async setAvatar(userId: string, avatarUrl: string) {
    await this.userModel.update({ _id: userId }, { avatar: avatarUrl });
  }

  /**
   * id查找用户
   * @param id  用户Id
   */
  async findById(id: number): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  /**
   * 创建用户
   * @param user 新用户
   */
  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return await createdUser.save();
  }

  /**
   * 更新用户信息
   * @param id 用户id
   * @param newUser 用户信息
   */
  async update(id: number, newUser: User): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user._id) {
      // console.log('user not found')
    }

    await this.userModel.findByIdAndUpdate(id, newUser).exec();
    return await this.userModel.findById(id).exec();
  }

  async updateUserInfo(userInfo: User): Promise<User> {
    const { _id, password } = userInfo;
    const userOld = await this.userModel.findOne({ password }).exec();
    console.log(userOld);

    if (userOld) {
      userInfo.password = userInfo.password_new;
      delete userInfo.password_new;

      const userNew = await this.userModel.findOneAndUpdate(_id, userInfo, {
        new: true,
      });
      return userNew;
    }
  }

  async delete(id: string): Promise<string> {
    try {
      await this.userModel.findByIdAndRemove(id).exec();
      return 'The user has been deleted';
    } catch (err) {
      return 'The user could not be deleted';
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(options: object): Promise<User> {
    return await this.userModel.findOne(options).exec();
  }

  async getAdminInfo(): Promise<User> {
    const adminInfo = await this.userModel
      .findOne(null, '-_id name slogan avatar')
      .exec();
    return adminInfo;
  }

  async signUp(user): Promise<User> {
    const { password } = user;
    user = Object.assign(user, { password: Base64.encode(password) });
    const newUser = await new this.userModel(user).save();
    return newUser;
  }

  async signIn(userInfo: User): Promise<any> {
    const { username: name, password } = userInfo;
    const user = await this.userModel.findOne({ username: name, password });
    const extantPwd = user && user.password;
    const extantPassword = extantPwd || this.makeMD5(CONFIG.USER.defaultPwd);
    const submittedPassword = this.makeMD5(this.decodeBase64(password));

    if (extantPassword === submittedPassword) {
      return await this.createToken(user);
    }
  }

  async createToken(user: any): Promise<ITokenResult> {
    // 对比密码是否相同
    const userToken = this.jwtService.sign({
      data: CONFIG.USER.data,
    });
    return Promise.resolve({
      access_token: userToken,
      expires_in: CONFIG.USER.expiresIn as number,
    });
  }
}

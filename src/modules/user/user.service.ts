import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { JwtService } from '@nestjs/jwt'
import { createHash } from 'crypto'
import * as lodash from 'lodash'
import { Base64 } from 'js-base64'
import { User } from './user.model'
import { ITokenResult } from './user.interface'
import { TMongooseModel } from '@app/common/interfaces/monoose.interface'
import { CustomError } from '@app/common/errors/custom.error'
import * as CONFIG from '@app/config'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: TMongooseModel<User>,
    private readonly jwtService: JwtService
  ) {}

  private makeMD5(password) {
    return createHash('md5')
      .update(password)
      .digest('hex')
  }

  private makeBase64(password) {
    return password ? Base64.encode(password) : password
  }

  private decodeBase64(password) {
    return password ? Base64.decode(password) : password
  }

  // 获取昵称
  private getExistUsername(user: any): string {
    if (user) {
      user = user.toObject()
      return user.username || this.makeMD5(CONFIG.USER.defaultUser as string)
    }
  }
  // 获取密码
  private getExistPassword(user: any): string {
    if (user) {
      user = user.toObject()
      console.log('user.password:', user.password)
      return user.password || this.makeMD5(CONFIG.USER.defaultPwd as string)
    }
  }

  // 校验token
  async validateUser(payload: any): Promise<any> {
    const isVerify = lodash.isEqual(payload.data, CONFIG.USER.data)
    return isVerify ? payload.data : null
  }

  // 签发token
  private createToken(): Promise<ITokenResult> {
    const userToken = this.jwtService.sign({
      data: CONFIG.USER.data,
    })
    return Promise.resolve({
      access_token: userToken,
      expires_in: CONFIG.USER.expiresIn as number,
    })
  }

  // 更新头像
  async setAvatar(userId: string, avatarUrl: string) {
    await this.userModel.updateOne({ _id: userId }, { avatar: avatarUrl })
  }

  // 查找所有用户
  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec()
  }

  // 查找单个用户
  async findOne(options: object): Promise<User> {
    return await this.userModel.findOne(options).exec()
  }

  // id查找用户
  async findById(id: number): Promise<User> {
    return await this.userModel.findById(id).exec()
  }

  // 创建用户
  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user)
    return await createdUser.save()
  }

  // 更新用户信息
  update(user: any): Promise<User> {
    const password = this.decodeBase64(user.password)
    const newPassword = this.decodeBase64(user.password_new)
    Reflect.deleteProperty(user, 'password')
    Reflect.deleteProperty(user, 'password_new')

    if (password || newPassword) {
      if (!password || !newPassword) {
        return Promise.reject('密码缺失了')
      }
      if (password === newPassword) {
        return Promise.reject('新旧密码不允许一样')
      }
    }

    this.userModel
      .findOne()
      .exec()
      .then(exsitUser => {
        if (password) {
          const sbmtPassword = this.makeMD5(password)
          const oldPassword = this.getExistPassword(exsitUser)

          if (sbmtPassword !== oldPassword) {
            return Promise.reject('原始密码错误')
          } else {
            user.password = this.makeMD5(newPassword)
          }
        }

        // 更新数据
        const action =
          exsitUser && !!exsitUser._id
            ? Object.assign(exsitUser, user)
                .save()
            : new this.userModel(user).save()

        return action.then(data => {
          data = data.toObject()
          Reflect.deleteProperty(data, 'password')
          return { result: data }
        })
      })
  }

  // 删除用户
  async delete(id: string): Promise<any> {
    return await this.userModel.findByIdAndRemove(id).exec()
  }

  // 获取用户信息
  async getUserInfo(): Promise<User> {
    return await this.userModel.findOne(null, '_id username slogan avatar').exec()
  }

  // 注册
  async signUp(user: User): Promise<any> {
    const { password } = user
    user = Object.assign(user, { password: this.makeMD5(password) })
    console.log('user:', user)
    const action = new this.userModel(user).save()
    return action.then(data => {
      console.log('data:', data)
      data = data.toObject()
      return Promise.resolve(data)
    })
  }

  // 用户登录
  signIn(userInfo: any): Promise<ITokenResult> {
    const { username, password } = userInfo

    return this.userModel
      .findOne({ username })
      .exec()
      .then(user => {
        console.log('user:', user)
        const existPwd = this.getExistPassword(user)
        console.log('existPwd:', existPwd)
        const existName = this.getExistUsername(user)
        const submittedPwd = this.makeMD5(password)
        console.log('submittedPwd:', submittedPwd)

        if (existName === username && existPwd === submittedPwd) {
          // 对比密码是否相同
          return Promise.resolve(this.createToken())
        }
        throw new CustomError({
          message: '用户名或密码错误',
        }, 400)
      })
  }
}

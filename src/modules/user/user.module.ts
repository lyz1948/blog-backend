import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypegooseModule } from 'nestjs-typegoose';
import * as jwt from 'jsonwebtoken';
import { UserService } from './user.service';
import { JwtStrategy } from './jwt.strategy';
import * as CONFIG from '../../app.config';
import { UserController } from './user.controller';
import { User } from './user.model';

@Module({
  imports: [
    TypegooseModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: CONFIG.USER.jwtTokenSecret as jwt.Secret,
      signOptions: {
        expiresIn: CONFIG.USER.expiresIn as number,
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [PassportModule, UserService],
})
export class UserModule {}

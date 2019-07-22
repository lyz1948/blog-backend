import { AuthGuard } from '@nestjs/passport';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { HttpUnauthorizeError } from '../errors/http.error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log('auth', err, user, info);
    if (err || !user) {
      throw err || new HttpUnauthorizeError(null, info && info.message);
    }
    return user;
  }
}
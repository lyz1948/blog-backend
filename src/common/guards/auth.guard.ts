import { AuthGuard } from '@nestjs/passport';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { HttpUnauthorizeError } from '../errors/http.error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(error, authInfo, errInfo) {
    if (authInfo && !error && !errInfo) {
      return authInfo;
    } else {
      throw error || new HttpUnauthorizeError(null, errInfo && errInfo.message);
    }
  }
}
import { HttpException, HttpStatus } from '@nestjs/common';
import { EApiErrorCode } from '@app/common/interfaces/api.error.interface';

export class ApiException extends HttpException {

  private errorMessage: string;
  private errorCode: EApiErrorCode;

  constructor(errorMessage: string, errorCode: EApiErrorCode, statusCode: HttpStatus) {

    super(errorMessage, statusCode);

    this.errorMessage = errorMessage;
    this.errorCode = errorCode;
  }

  getErrorCode(): EApiErrorCode {
    return this.errorCode;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }
}

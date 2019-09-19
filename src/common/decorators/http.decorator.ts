import { HttpStatus, SetMetadata } from '@nestjs/common';
import { TMessage } from '../interfaces/http.interface';
import * as META from '../constants/meta.constant';
import * as TEXT from '../constants/text.constant';
import * as lodash from 'lodash';

interface IBuildDecoratorOpts {
  errCode?: HttpStatus;
  successCode?: HttpStatus;
  errMessage?: TMessage;
  successMessage?: TMessage;
  usePaginate?: boolean;
}

interface IHandlerOpts {
  error?: HttpStatus;
  success?: HttpStatus;
  message: TMessage;
  usePaginate?: boolean;
}

type THandlerOpts = TMessage | IHandlerOpts;

export const buildHttpDecorator = (
  options: IBuildDecoratorOpts,
): MethodDecorator => {
  const {
    errCode,
    successCode,
    errMessage,
    successMessage,
    usePaginate,
  } = options;

  return (_, __, descriptor: PropertyDescriptor) => {
    if (errCode) {
      SetMetadata(META.HTTP_ERROR_CODE, errCode)(descriptor.value);
    }
    if (successCode) {
      SetMetadata(META.HTTP_SUCCESS_CODE, successCode)(descriptor.value);
    }
    if (errMessage) {
      SetMetadata(META.HTTP_ERROR_MESSAGE, errMessage)(descriptor.value);
    }
    if (successMessage) {
      SetMetadata(META.HTTP_SUCCESS_MESSAGE, successMessage)(descriptor.value);
    }
    if (usePaginate) {
      SetMetadata(META.HTTP_RES_TRANSFORM_PAGENATE, usePaginate)(
        descriptor.value,
      );
    }
    return descriptor;
  };
};

export function handle(args: THandlerOpts): MethodDecorator;
export function handle(...args) {
  const option = args[0];

  const isOption = (value: THandlerOpts): value is IHandlerOpts =>
    lodash.isObject(value);
  const message: TMessage = isOption(option) ? option.message : option;
  const errMessage: TMessage = message + TEXT.HTTP_ERROR_SUFIX;
  const successMessage: TMessage = message + TEXT.HTTP_SUCCESS_SUFIX;
  const errCode: HttpStatus = isOption(option) ? option.error : null;
  const successCode: HttpStatus = isOption(option) ? option.success : null;
  const usePaginate: boolean = isOption(option) ? option.usePaginate : null;

  return buildHttpDecorator({
    errCode,
    successCode,
    errMessage,
    successMessage,
    usePaginate,
  });
}

export const error = (
  message: TMessage,
  statusCode: HttpStatus,
): MethodDecorator => {
  return buildHttpDecorator({ errMessage: message, errCode: statusCode });
};

export const success = (
  message: TMessage,
  statusCode?: HttpStatus,
): MethodDecorator => {
  return buildHttpDecorator({
    successMessage: message,
    successCode: statusCode,
  });
};

export const paginate = (): MethodDecorator => {
  return buildHttpDecorator({ usePaginate: true });
};

export const HttpProcessor = {
  error,
  success,
  handle,
  paginate,
};

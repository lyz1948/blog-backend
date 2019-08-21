import { environment, isDevMode } from './app.environment';

export const APP = {
  limit: 100,
  port: 5381,
  env: environment,
  dev: isDevMode,
};

export const MONGO = {
  uri: 'mongodb://localhost/nest',
};

export const ARTICLE = {
  author: 'lyz',
  thumb: 'http://cdn.ykpine.com/image/coding.jpeg',
};

export const CROSS_DOMAIN = {
  allowedOrigins: 'http://localhost:5381',
};

export const INFO = {
  version: '1.0.0',
};

export const QINIU = {
  bucket: 'ykpine',
  ak: 'YV3OuTyQEJlyHxJxT_IP9wUSQqn4kCVHW0JTv8d2',
  sk: 'hdddzEji_2UDWTlj7gd5Q6BNItme5lsxoC32zwCt',
};

export const USER = {
  user: 'root',
  data: { user: 'root' },
  defaultPwd: 'root',
  jwtTokenSecret: 'nestblog',
  expiresIn: 3600,
};

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

export const USER = {
  user: 'guest',
  data: { user: 'root' },
  defaultPwd: 'admin',
  jwtTokenSecret: 'nestblog',
  expiresIn: 3600,
};

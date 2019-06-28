// import * as mongoose from 'mongoose';
import * as CONFIG from '../../app.config';
import { mongoose } from '../transforms/mongoose.transform';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {
      const connect = () =>
        mongoose.connect(CONFIG.MONGO.uri, {
          useCreateIndex: true,
          useNewUrlParser: true,
          useFindAndModify: false,
        });

      mongoose.connection.on('error', error => {
        const timeout = 6;
        setTimeout(connect, timeout);
        setTimeout(() => {
          console.log(`数据库连接失败${timeout}后重启`);
        }, 0);
      });

      mongoose.connection.on('open', () => {
        setTimeout(() => {
          console.log('数据库连接成功');
        }, 0);
      });
      return await connect();
    },
  },
];

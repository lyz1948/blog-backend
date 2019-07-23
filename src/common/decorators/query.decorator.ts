import { createParamDecorator } from '@nestjs/common';
import * as lodash from 'lodash';
import { Types } from 'mongoose';

enum EQueryOptionField {
  Page = 'page',
  PerPage = 'per_page',
  Sort = 'sort',
  Date = 'date',
  Keyword = 'keyword',
  State = 'state',
  Public = 'public',
  Origin = 'origin',
  ParamsId = 'paramsId',
  CommentState = 'commentState',
}

// 传入的参数
interface IQueryParamsConfig {
  [key: string]: string | number | boolean | Date | RegExp | Types.ObjectId | IQueryParamsConfig;
}

export type TQueryConfig = EQueryOptionField | string | IQueryParamsConfig;

// 导出结构
export interface IQueryParamsResult {
  querys: IQueryParamsConfig; // 用于 paginate 的查询参数
  options: IQueryParamsConfig; // 用于 paginate 的查询配置参数
  params: IQueryParamsConfig; // 路由参数
  origin: IQueryParamsConfig; // 原味的 querys 参数
  request: any; // 用于 request 的对象
  visitors: { // 访客信息
    ip: string; // 真实 IP
    ua: string; // 用户 UA
    referer: string; // 跳转来源
  };
  isAuthenticated: boolean; // 是否鉴权
}

// 验证器
interface IValidateError {
  name: string;
  field: EQueryOptionField;
  isAllowed: boolean;
  isIllegal: boolean;
  setValue(): void;
}

// export const QueryDecorator = createParamDecorator((customConfig: TQueryConfig[], request)): IQueryParamsResult => {
//   // 是否已验证权限
//   const isAuthenticated = request.isAuthenticated();

//   const transformConfig: IQueryParamsConfig = {
//     [EQueryOptionField.Page]: 1,
//     [EQueryOptionField.PerPage]: true,
//     [EQueryOptionField.ParamsId]: 'id',
//     [EQueryOptionField.Sort]: true,
//   };

//   if (customConfig) {
//     customConfig.forEach(field => {
//       if (lodash.isString(field)) {
//         transformConfig[field] = true;
//       }
//       if (lodash.isObject(field)) {
//         Object.assign(transformConfig, field);
//       }
//     })
//   }

//   const querys: IQueryParamsConfig = {}
//   const options: IQueryParamsConfig = {}
//   const params: IQueryParamsConfig = lodash.merge({ url: request.url }, request.params);
//   const date = request.query.date;
//   const paramsId = request.params[transformConfig.paramsId as string];
//   const qs = request.query
//   const [page, per_page, sort, state, ppublic, origin] = [
//     qs.page || transformConfig.page,
//     qs.per_page,
//     qs.sort,
//     qs.state,
//     qs.public,
//     qs.origin,
//   ].map(item => item != null ? Number(item) : item);

//   // 验证字段是否被允许
//   const isEnableField = field => field != null && field !== false;
// }

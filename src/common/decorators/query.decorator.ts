import { createParamDecorator, HttpException, HttpStatus } from '@nestjs/common'
import * as lodash from 'lodash'
import { Types } from 'mongoose'
import {
	EStateSortType,
	EStateComment,
	EStatePublish,
	EStatePublic,
	EStateOrigin,
} from '@app/common/interfaces/state.interface'

export enum EQueryOptionField {
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
	[key: string]:
		| string
		| number
		| boolean
		| Date
		| RegExp
		| Types.ObjectId
		| IQueryParamsConfig
}

export type TQueryConfig = EQueryOptionField | string | IQueryParamsConfig

// 导出结构
export interface IQueryParamsResult {
	querys: IQueryParamsConfig // 用于 paginate 的查询参数
	options: IQueryParamsConfig // 用于 paginate 的查询配置参数
	params: IQueryParamsConfig // 路由参数
	origin: IQueryParamsConfig // 原味的 querys 参数
	request: any // 用于 request 的对象
	visitors: {
		// 访客信息
		ip: string // 真实 IP
		ua: string // 用户 UA
		referer: string // 跳转来源
	}
	isAuthenticated: boolean // 是否鉴权
}

// 验证器
interface IValidateError {
	name: string
	field: EQueryOptionField
	isAllowed: boolean
	isIllegal: boolean
	setValue(): void
}

export const QueryDecorator = createParamDecorator(
	(customConfig: TQueryConfig[], request: any): IQueryParamsResult => {
		// 是否已验证权限
		const isAuthenticated = request.isAuthenticated()
		// 默认参数
		const transformConfig: IQueryParamsConfig = {
			[EQueryOptionField.Page]: 1,
			[EQueryOptionField.PerPage]: true,
			[EQueryOptionField.ParamsId]: 'id',
			[EQueryOptionField.Sort]: true,
		}

		if (customConfig) {
			customConfig.forEach(field => {
				if (lodash.isString(field)) {
					transformConfig[field] = true
				}
				if (lodash.isObject(field)) {
					Object.assign(transformConfig, field)
				}
			})
		}

		const querys: IQueryParamsConfig = {}
		const options: IQueryParamsConfig = {}
		const params: IQueryParamsConfig = lodash.merge(
			{ url: request.url },
			request.params
		)
		const date = request.query.date
		const paramsId = request.params[transformConfig.paramsId as string]
		const qs = request.query
		const [page, per_page, sort, state, ppublic, origin] = [
			qs.page || transformConfig.page,
			qs.per_page,
			qs.sort,
			qs.state,
			qs.public,
			qs.origin,
		].map(item => (item != null ? Number(item) : item))

		const validates: IValidateError[] = [
			{
				name: '路由/ID',
				field: EQueryOptionField.ParamsId,
				isAllowed: true,
				isIllegal: paramsId != null && !isAuthenticated && isNaN(paramsId),
				setValue() {
					// 如果用户传了 ID，则转为数字或 ObjectId
					if (paramsId != null) {
						params[transformConfig.paramsId as string] = isNaN(paramsId)
							? Types.ObjectId(paramsId)
							: Number(paramsId)
					}
				},
			},
			{
				name: '排序/sort',
				field: EQueryOptionField.Sort,
				isAllowed:
					lodash.isUndefined(sort) ||
					[
						EStateSortType.Asc,
						EStateSortType.Desc,
						EStateSortType.Hot,
					].includes(sort),
				isIllegal: false,
				setValue() {
					options.sort = {
						_id: sort != null ? sort : EStateSortType.Desc,
					}
				},
			},
			{
				name: '目标页/page',
				field: EQueryOptionField.Page,
				isAllowed:
					lodash.isUndefined(page) ||
					(lodash.isInteger(page) && Number(page) > 0),
				isIllegal: false,
				setValue() {
					if (page != null) {
						options.page = page
					}
				},
			},
			{
				name: '每页数量/per_page',
				field: EQueryOptionField.PerPage,
				isAllowed:
					lodash.isUndefined(per_page) ||
					(lodash.isInteger(per_page) && Number(per_page) > 0),
				isIllegal: false,
				setValue() {
					if (per_page != null) {
						options.limit = per_page
					}
				},
			},
			{
				name: '日期查询/date',
				field: EQueryOptionField.Date,
				isAllowed:
					lodash.isUndefined(date) ||
					new Date(date).toString() !== 'Invalid Date',
				isIllegal: false,
				setValue() {
					if (date != null) {
						const queryDate = new Date(date)
						querys.create_at = {
							$gte: new Date(((queryDate as any) / 1000 - 60 * 60 * 8) * 1000),
							$lt: new Date(((queryDate as any) / 1000 + 60 * 60 * 16) * 1000),
						}
					}
				},
			},
			{
				name: '发布状态/state', // 评论或其他数据
				field: EQueryOptionField.State,
				isAllowed:
					lodash.isUndefined(state) ||
					(transformConfig[EQueryOptionField.CommentState]
						? [
								EStateComment.Auditing,
								EStateComment.Deleted,
								EStateComment.Published,
								EStateComment.Spam,
						  ].includes(state)
						: [
								EStatePublish.Published,
								EStatePublish.Draft,
								EStatePublish.Recycle,
						  ].includes(state)),
				isIllegal:
					!isAuthenticated &&
					state != null &&
					state !==
						(transformConfig[EQueryOptionField.CommentState]
							? EStateComment.Published
							: EStatePublish.Published),
				setValue() {
					// 管理员/任意状态 || 普通用户/已发布
					if (state != null) {
						querys.state = state
						return false
					}
					// 普通用户/未设置
					if (!isAuthenticated) {
						querys.state = transformConfig[EQueryOptionField.CommentState]
							? EStateComment.Published
							: EStatePublish.Published
					}
				},
			},
			{
				name: '公开状态/public',
				field: EQueryOptionField.Public,
				isAllowed:
					lodash.isUndefined(ppublic) ||
					[
						EStatePublic.Public,
						EStatePublic.Password,
						EStatePublic.Secret,
					].includes(ppublic),
				isIllegal:
					ppublic != null &&
					!isAuthenticated &&
					ppublic !== EStatePublic.Public,
				setValue() {
					// 管理员/任意状态 || 普通用户/公开
					if (ppublic != null) {
						querys.public = ppublic
						return false
					}
					// 普通用户/未设置
					if (!isAuthenticated) {
						querys.public = EStatePublic.Public
					}
				},
			},
			{
				name: '来源状态/origin',
				field: EQueryOptionField.Origin,
				isAllowed:
					lodash.isUndefined(origin) ||
					[
						EStateOrigin.Original,
						EStateOrigin.Hybrid,
						EStateOrigin.Reprint,
					].includes(origin),
				isIllegal: false,
				setValue() {
					if (origin != null) {
						querys.origin = origin
					}
				},
			},
		]

		// 验证字段是否被允许
		const isEnableField = field => field != null && field !== false

		// 验证参数及生成参数
		validates.forEach(validate => {
			if (!isEnableField(transformConfig[validate.field])) {
				return false
			}
			if (!validate.isAllowed) {
				throw new HttpException(
					'参数不合法：' + validate.name,
					HttpStatus.BAD_REQUEST
				)
			}
			if (validate.isIllegal) {
				throw new HttpException(
					'权限与参数匹配不合法：' + validate.name,
					HttpStatus.BAD_REQUEST
				)
			}
			validate.setValue()
		})

		/**
		 * 处理剩余的规则外参数
		 * 1. 用户传入配置与默认配置混合得到需要处理的参数字段
		 * 2. 内置一堆关键参数的校验器
		 * 3. 剩下的非内部校验的非关键参数，在此合并至 querys
		 */

		// 已处理字段
		const isProcessedFields = validates.map(validate => validate.field)
		// 配置允许的字段
		const allAllowFields = Object.keys(transformConfig)
		// 剩余的待处理字段 = 配置允许的字段 - 已处理字段
		const todoFields = lodash.difference(allAllowFields, isProcessedFields)
		// 将所有待处理字段循环，将值循环至 querys
		todoFields.forEach(field => {
			const targetValue = request.query[field]
			if (targetValue != null) querys[field] = targetValue
		})

		// 挂载到 request 上下文
		request.queryParams = { querys, options, params, isAuthenticated }

		// 来源 IP
		const ip = (
			request.headers['x-forwarded-for'] ||
			request.headers['x-real-ip'] ||
			request.connection.remoteAddress ||
			request.socket.remoteAddress ||
			request.connection.socket.remoteAddress ||
			request.ip ||
			request.ips[0]
		).replace('::ffff:', '')

		// 用户标识
		const ua = request.headers['user-agent']

		const result = {
			querys,
			options,
			params,
			request,
			origin: request.query,
			visitors: { ip, ua, referer: request.referer },
			isAuthenticated,
		}
		return result
	}
)

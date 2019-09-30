import * as _mongoose from 'mongoose'
import * as _mongoosePaginate from 'mongoose-paginate'
import * as _mongooseAutoIncrement from 'mongoose-auto-increment'
import * as CONFIG from '@app/config'

_mongoose.set('useFindAndModify', false)
_mongoose.set('useNewUrlParser', true)
_mongoose.set('useCreateIndex', true)

// 使用nodejs中的promise 替换mongoose中的promise
// tslint:disable-next-line:whitespace
// tslint:disable-next-line:align
; (_mongoose as any).Promise = global.Promise

// 使用插件自增id等
_mongooseAutoIncrement.initialize(_mongoose.connection)

// 使用分页插件，全局同一配置每次查询数据库的返回的数据条数
// tslint:disable-next-line:whitespace
// tslint:disable-next-line:align
; (_mongoosePaginate as any).paginate.options = {
	limit: CONFIG.APP.limit,
}

// 封装后重新导出
export const mongoose = _mongoose
export const mongoosePaginate = _mongoosePaginate
export const mongooseAutoIncrement = _mongooseAutoIncrement
export default mongoose

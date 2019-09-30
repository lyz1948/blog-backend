import { environment, isDevMode } from '@app/app.environment'
import { argv } from 'yargs'

export const APP = {
	limit: 10,
	port: 5381,
	env: environment,
	dev: isDevMode,
}

export const MONGO = {
	uri: `mongodb://127.0.0.1:${argv.dbport || 27017}/nest`,
}

export const ARTICLE = {
	author: 'lyz',
	thumb: 'http://cdn.ykpine.com/image/coding.jpeg',
}

export const CROSS_DOMAIN = {
	allowedOrigins: argv.sites || ['http://ykpine.com', 'http://admin.ykpine.com'],
}

export const INFO = {
	version: '1.0.0',
}

export const USER = {
	data: argv.user_data || { user: 'root' },
	defaultUser: argv.user_name || 'root',
	defaultPwd: argv.user_password || 'root',
	jwtTokenSecret: argv.user_token_key || 'nestblog',
	expiresIn: argv.user_expires || 3600,
}

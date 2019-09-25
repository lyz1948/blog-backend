const tsConfig = require('./tsconfig.json')
const tsConfigPaths = require('tsconfig-paths')

const cleanup = tsConfigPaths.register({
	baseUrl: tsConfig.compilerOptions.outDir,
	paths: tsConfig.compilerOptions.paths,
})

cleanup()

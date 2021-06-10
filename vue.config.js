const path = require('path')

module.exports = {
	publicPath: './',
	pluginOptions: {
		electronBuilder: {
			nodeIntegration: true,
			builderOptions: {
				productName: 'Database Experiment 2',
				extraFiles: {
					from: 'sqlite3.db',
					to: './resources/app.asar.unpacked/sqlite3.db'
				}
			},
			asarUnpack: ['sqlite3.db']
		}
	},
	chainWebpack: config => {
		config.resolve.alias.set('@', path.resolve(__dirname, 'src'));
	}
}

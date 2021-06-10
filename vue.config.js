const path = require('path')

module.exports = {
	publicPath: './',
	pluginOptions: {
		electronBuilder: {
			nodeIntegration: true,
			builderOptions: {
				productName: 'Database Experiment 2'
			}
		}
	},
	chainWebpack: config => {
		config.resolve.alias.set('@', path.join(__dirname, 'src'));
	}
}

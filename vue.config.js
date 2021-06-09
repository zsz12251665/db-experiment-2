const path = require('path')

module.exports = {
	publicPath: "./",
	"pluginOptions": {
		"electronBuilder": {
			"nodeIntegration": true
		}
	},
	chainWebpack: config => {
		config.resolve.alias.set('@', path.join(__dirname, 'src'));
	}
}

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { description } = require('../package.json');
const { version } = require('react/package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const resolve = dir => path.resolve(__dirname, '..', dir);
module.exports = ({ mode }) => ({
	resolveLoader: {
		modules: ['node_modules', path.resolve(__dirname, '../project-scripts/loaders')],
		moduleExtensions: ['-loader']
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.jsx?$/,
				use: [
					{
						loader: 'eslint-loader',
						// options: {
						// 	formatter: require('eslint-friendly-formatter')
						// }
					}
				],
				exclude: resolve('node_modules')
			},
			{
				test: /\.ts(x?)$/,
				use: ['babel', {
					loader: 'ts-loader',
					options: { transpileOnly: true }
				}]
			},
			{
				test: /\.jsx?$/,
				use: ['babel', 'async-catch'],
				exclude: /node_modules/
			},
			{
				test: /\.(le|c)ss$/,
				use: ['style', {
					loader: 'css',
					options: {
						modules: {
							localIdentName: '[local]_[hash:base64:6]'
						},
						importLoaders: 1,
						localsConvention: 'camelCase',
						// localIdentName: '[path][name]__[local]--[hash:base64:5]'
					}
				}, 'less'],
				include: resolve('src'),
				exclude: [resolve('node_modules'), resolve('src/assets/css')],
			},{
				test: /\.(le|c)ss$/,
				use: [MiniCssExtractPlugin.loader, 'css', 'less'],
				include: [resolve('node_modules'), resolve('src/assets/css')]
			},
			{
				test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url',
				options: {
					limit: 10000,
					name: '[name]-[hash:5].[ext]'
				}
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			env: mode,
			base: './',
			reactVersion: version,
			title: description,
			filename: 'index.html',
			template: './src/index.html',
			// excludeChunks: ['survey'],
			inject: true,
			minify: mode === 'production'
		})],
	resolve: {
		alias: {
			'@components': resolve('src/components'),
			'@common': resolve('src/common'),
			'@assets': resolve('src/assets')
		},
		extensions: ['.js', '.jsx', '.ts', '.tsx']
	}
});

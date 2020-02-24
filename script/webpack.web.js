const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const pkg = require('../package.json');
const webpackBase = require('./webpack.base');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const buildOutputDir = path.join(__dirname, '../dist');
const getEenvConfig = require('./env.config');

module.exports = (args, ...others) => {
	const evnConfig = getEenvConfig(args);
	console.log(args);
	const mode = args.mode;
	return webpackMerge(webpackBase({ mode }, ...others), {
		mode,
		devtool: 'none',
		entry: {
			app: './src/output.tsx'
		},
		externals: {
			'react': 'React',
            'react-dom': 'ReactDOM',
		},
		output: {
			filename: 'rc-mate-web.js',
			path: buildOutputDir,
            publicPath: './',
            library: '__rc-mate__',
			libraryTarget: 'window'
		},
		module: {
		},
		performance: {
			hints: false
		},
		optimization: {
			minimizer: [
				new UglifyJsPlugin({
					uglifyOptions: {
						cache: true,
						parallel: true,
						sourceMap: true,
						warnings: false
					}
				}),
				new OptimizeCSSAssetsPlugin({
					assetNameRegExp: /\.min\.css$/,
					safe: true,
					cache: true,
					parallel: true,
					discardComments: {
						removeAll: true
					}
				})
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: 'index.css',
				chunkFilename: '[name].css',
				allChunks: true
			}),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(mode)
			})
		]
	});
	
}

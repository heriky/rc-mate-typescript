const path = require('path');
const webpack = require('webpack');
const webpackBase = require('./webpack.base');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const { mockServer } = require('./utils');

const PREFIX = require('../package.json').apiPrefix;

const useMock = true;
const devConfig =  useMock ? {
	before: app => mockServer(path.resolve(__dirname, '../mock'), app, { apiPrefix: PREFIX }),
} : {
	proxy: {
		[PREFIX]: {}
	}
};

module.exports = ({ mode, mock }, ...others) => webpackMerge(webpackBase({ mode }, ...others), {
	mode,
	devServer: {
		clientLogLevel: 'warning',
		disableHostCheck: true,
		port: 8007,
		hot: true,
		host: '0.0.0.0',
		contentBase: '../src',
		compress: true,
		overlay: {
			warnings: false,
			errors: true
		},
		...devConfig
	},
	devtool: 'cheap-module-eval-source-map',
	entry: {
		'app': './src/index.tsx'
	},
	output: {
		publicPath: '/',
		filename: '[name].js'
	},
	bail: true,
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(mode)
		}),
		new MiniCssExtractPlugin({
			filename: '[name]-[hash:5].min.css',
			chunkFilename: '[name].css',
			allChunks: true
		}),
		new ForkTsCheckerWebpackPlugin({
			async: false
		})
	]
});

const { resolve } = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        main: resolve(__dirname, './src/index')
    },
    output: {
        path: resolve(__dirname, './dist'),
        filename: '[name].[contenthash].js',
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
            },
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.json$/,
                type: 'asset/resource'
            },
            {
                test: /\.html$/,
                exclude: /index\.html$/,
                type: 'asset/source'
            },
            {
                test: /\.(png|jpe?g|gif|webp|svg)$/i,
                type: 'asset-resource',
                generator: {
                    filemane: 'images/[contenthash][ext]'
                }
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve(__dirname, './src/index.html'),
            inject: 'head',
            scriptLoading: 'defer',
        }),
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css'
        }),
    ],
    devtool: 'source-map',
    devServer: {
        port: 8888,
        historyApiFallback: true,
    }
};

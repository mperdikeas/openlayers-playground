'use strict';

const webpack = require('webpack');
const path    = require('path');

const alias = require('./config/webpack/alias');
const isDev = require('./config/webpack/isDev');
const getEnvKeys = require('./config/webpack/getEnvKeys');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: isDev() ? path.resolve(__dirname, 'src', 'index.html') : path.resolve(__dirname, 'src', 'prod-index.html'),
    filename: 'index.html',
    inject: 'body'
});

const envKeys = getEnvKeys();

const config = {
    mode: isDev() ? 'development' : 'production',
    devtool: isDev () ? 'eval-cheap-module-source-map' : 'hidden-source-map',
    devServer: {
        contentBase: './dist'
        /* NB. Both the following:
         *     a) `historyApiFallback: true` (or, equivalently, `historyApiFallback: {index: '/'}`)
         *     - AND -
         *     b) publicPath: "/" cf. SSE-1591357301
         *
         *     ... are necessary. See:
         *
         * See:
         *    https://stackoverflow.com/a/39985334/274677
         *    https://stackoverflow.com/a/50179280/274677
         */
        , historyApiFallback: true
        //        , historyApiFallback: {index: '/'}
        , watchContentBase: true
    },
    entry: path.resolve(__dirname, './src/main.tsx'),
    output: {
        publicPath: "/",
        path: path.resolve(__dirname, 'dist'), // SSE-1591357301
        filename: isDev() ? 'bundle.js' : 'bundle.[contenthash].js'
    },
    resolve: {
      /*
                * I am not sure why this is needed but I got it from here:
                *     https://webpack.js.org/guides/typescript/
                *
                */
        extensions: [ '.tsx', '.ts', '.js' ],
      alias: {
        ...alias()
      }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, 'src/'),
                use: 'babel-loader'
            },{
                test:/\.s?css$/,
                loader: ['style-loader', 'css-loader', 'sass-loader']
            },{
                test: /\.(png|jpg|jpeg|gif|woff)$/,
                loader: 'url-loader?limit=9999&name=[path][name].[ext]'
            },{
                test: /\.README$/, loader: 'null'
            },{
                test: /.*data\/.*\.zip/,
                loader: 'file-loader'
            },{ // https://github.com/bhovhannes/svg-url-loader
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 10000
                        }
                    },
                ]
            },{
                test: /countries.geo.json/,
                loader: 'file-loader',
                /* the below is crucial otherwise one gets:
                 * Module parse failed: Unexpected token m in JSON at position 0 while parsing near 'module.export
                 *
                 * cf. https://github.com/webpack-contrib/file-loader/issues/259
                 */
                type: 'javascript/auto',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
      HTMLWebpackPluginConfig,
      new webpack.DefinePlugin(envKeys)
    ],
    node: {
        fs: "empty" // This is to account for what appears to be a bug: https://github.com/josephsavona/valuable/issues/9`
    }
};

module.exports = config;

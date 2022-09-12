const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');

module.exports = (env) => ({
    mode: env.WEBPACK_SERVE ? 'development' : 'production',
    entry: "./src/index.tsx",
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: 'images/[name].[contenthash:8].[ext]',
                        },
                    }
                ]
            },
            {
                test: /\.(mp3)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: 'audio/[name].[contenthash:8].[ext]',
                        },
                    }
                ]
            },
            {
                test: /\.(xls|xlsx)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: 'excel/[name].[contenthash:8].[ext]',
                        },
                    }
                ]
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        modules: [
            'node_modules',
            path.resolve(__dirname, '..', 'src'),
        ],
        // alias: {
        //     "": "../"
        // }
    },
    plugins: [
        new Dotenv({
            path: path.resolve(__dirname, '..', '.env.local'),
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
        }),
    ]
});
const path = require("path");
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const commonWebpackConfig = require('./webpack.common');
// Language: javascript
// eslint-disable-next-line no-shadow
module.exports = (env) => merge(commonWebpackConfig(env),  {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '..', 'build'),
        filename: `js/[name].[contenthash:8].bundle.js`,
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(css)$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "public",
                    globOptions: {
                        ignore: ["**/index.html"],
                    }
                },
            ],
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                format: {
                    comments: false,
                },
            },
            extractComments: false,
        })],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    filename: 'js/[name].[contenthash:8].vendor.js',
                    priority: -10,
                    reuseExistingChunk: true,
                },
                default: {
                    filename: 'js/[name].[contenthash:8].chunk.js',
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    // performance: {
    //     maxEntrypointSize: 800000 //  maximium file build is 800000 (byte)
    // }
});
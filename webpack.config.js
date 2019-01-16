const path = require('path');
const webpack = require('webpack');
const gamedir = path.resolve(__dirname, 'game');
// const Fiber = require('fibers');
const dotenv = require('dotenv');
const env = dotenv.parse(require('fs').readFileSync('./.env'));

module.exports = (prod = false) => ({
    entry: [
        path.resolve(gamedir, 'ts/index.ts'),
        path.resolve(gamedir, 'scss/index.scss')
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'elemental.css',
                        },
                    },
                    { loader: 'extract-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => {
                                let plugins = [];
                                if (prod) plugins.push(require('cssnano')());
                                plugins.push(require('autoprefixer')());
                                return plugins;
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [
                                'node_modules'
                            ],
                            // fiber: Fiber
                        }
                    },
                ]
            }
        ]
    },
    plugins: [
    ],
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    output: {
        filename: 'elemental.js',
        path: path.resolve(gamedir, 'out')
    },
    devtool: prod ? "none" : "source-map",
    mode: prod ? "production" : "development"
});
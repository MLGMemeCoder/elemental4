const path = require('path');
const gamedir = path.resolve(__dirname, 'game');
// const Fiber = require('fibers');
const dotenv = require('dotenv');
const env = dotenv.parse(require('fs').readFileSync('./.env'));

module.exports = {
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
                                if (env.MINIFY_OUTPUT === "true") plugins.push(require('cssnano')());
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
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'elemental.js',
        path: path.resolve(gamedir, 'out')
    },
    devtool: "source-map",
    mode: (env.MINIFY_OUTPUT !== undefined)
        ? (env.MINIFY_OUTPUT === "true" ? 'production' : 'development')
        : (process.env.NODE_ENV || 'production'),
};
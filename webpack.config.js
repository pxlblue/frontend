const webpack = require('webpack')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = (env, argv) => {
  const getEnv = () =>
    argv.mode === 'development' ? 'development' : 'production'
  const isDev = () => getEnv() === 'development'
  console.log('(pxl) building in', getEnv())

  return {
    mode: getEnv(),
    entry: {
      bundle: './src/index.jsx',
    },
    output: {
      filename: 'js/[name].[hash].js',
      chunkFilename: 'js/[name].[chunkhash].js',
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
    },
    devServer: {
      host: '0.0.0.0',
      contentBase: path.resolve(__dirname, 'build'),
      historyApiFallback: true,
      compress: true,
      port: 8080,
      headers: {
        'Service-Worker-Allowed': '/',
      },
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      modules: [
        'node_modules',
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'src', 'css'),
        path.resolve(__dirname, 'src', 'js'),
      ],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
        },
        {
          test: /\.(c|sa|sc)ss$/,
          include: [/node_modules/],
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: false,
              },
            },
            'fast-sass-loader',
          ],
        },
        {
          test: /\.(c|sa|sc)ss$/,
          exclude: [/node_modules/],
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                /*modules: true,  
                importLoaders: 2,
                camelCase: true,
                localIdentName: isDev()
                  ? '💦[local]__[hash:base62:5]'
                  : '💦[hash:base62:5]',*/
                modules: {
                  exportGlobals: true,
                  localIdentName: '[path][name]__[local]--[hash:base64:5]',
                  context: path.resolve(__dirname, 'src'),
                  hashPrefix: '💦',
                },
              },
            },
            'fast-sass-loader',
          ],
        },
        {
          test: /\.(svg|png|jpg|eot|woff|ttf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/',
              },
            },
          ],
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: 'all',

        cacheGroups: {
          /*critical: {
            name: 'critical',
            test: /(.+)?(critical)(.+)?\.(c|sa|sc)ss$/,
            chunks: 'all',
            enforce: true,
            priority: 1,
          },*/
          styles: {
            name: 'styles',
            test: /\.(c|sa|sc)ss$/,
            chunks: 'all',
            enforce: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    plugins: [
      new webpack.DllReferencePlugin({
        context: '.',
        manifest: './build/vendor-manifest.json',
      }),
      new webpack.DefinePlugin({
        //'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        S_API_BASE: JSON.stringify(
          isDev() ? 'http://localhost:3000' : 'https://api.pxl.blue'
        ),
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
      }),
      new HtmlWebpackPlugin({
        title: 'pxl.blue',
        appMountId: 'app-mount',
        template: path.resolve(__dirname, 'src', 'tmpl', 'index.html'),
      }),
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          { urlPattern: new RegExp('/'), handler: 'StaleWhileRevalidate' },
        ],
      }),
    ],
  }
}

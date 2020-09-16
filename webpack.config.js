const webpack = require('webpack'),
  child_process = require('child_process'),
  path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
  TerserJSPlugin = require('terser-webpack-plugin'),
  WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = (env, argv) => {
  const getEnv = () =>
    argv.mode === 'development' ? 'development' : 'production'
  const isDev = () => getEnv() === 'development'
  const commitSha = child_process
    .execSync('git rev-parse HEAD')
    .toString('utf8')
    .replace(/\n/gi, '')
  console.log('(pxl) building in', getEnv())

  return {
    mode: getEnv(),
    entry: {
      bundle: './src/index.jsx',
    },
    output: {
      filename: isDev() ? 'js/[name].[hash].js' : 'js/[hash].js',
      chunkFilename: 'js/[id].[chunkhash].js',
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
        path.resolve(__dirname, 'src', 'styles'),
        path.resolve(__dirname, 'src', 'components'),
      ],
      alias: {
        styles: path.resolve(__dirname, 'src', 'styles'),
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          critical: {
            name: 'critical',
            test: /(.+)?(critical)(.+)?\.(c|sa|sc)ss$/,
            chunks: 'all',
            enforce: true,
            priority: 1,
          },
          styles: {
            name: 'styles',
            test: /\.(c|sa|sc)ss$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    plugins: [
      new webpack.DllReferencePlugin({
        context: '.',
        manifest: './build/vendor-manifest.json',
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(getEnv()),
        S_API_BASE: JSON.stringify(
          isDev() ? 'http://localhost:3000' : 'https://api.pxl.blue'
        ),
        DSN: JSON.stringify(
          'https://d6c26dc4eabf418d8e747a0cdefffa4c@sentry.pxl.blue/2'
        ),
        RELEASE: JSON.stringify(commitSha),
      }),
      new MiniCssExtractPlugin({
        filename: isDev() ? 'css/[name].css' : 'css/[hash].css',
      }),
      new HtmlWebpackPlugin({
        title: 'pxl.blue',
        appMountId: 'app-mount',
        template: path.resolve(__dirname, 'src', 'tmpl', 'index.html'),
      }),
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
      }),
    ],
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
                modules: {
                  exportGlobals: true,
                  exportLocalsConvention: 'camelCase',
                  localIdentName: isDev()
                    ? '[local]__[hash:base62:5]'
                    : '[hash:base62:5]',
                },
              },
            },
            'fast-sass-loader',
          ],
        },
        {
          test: /\.(svg|png|jpg|eot|woff2?|ttf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: isDev() ? '[name].[ext]' : '[hash].[ext]',
                outputPath: 'assets/',
              },
            },
          ],
        },
      ],
    },
  }
}

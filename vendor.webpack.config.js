const webpack = require('webpack')
const path = require('path')

module.exports = (env, argv) => {
  const getEnv = () =>
    argv.mode === 'development' ? 'development' : 'production'
  const isDev = () => getEnv() === 'development'
  console.log('(vendor) building in', getEnv())
  return {
    mode: getEnv(),
    entry: {
      vendor: [
        'react',
        'react-dom',
        'react-router',
        'classnames',
        'prop-types',
        'evergreen-ui',
      ],
    },
    output: {
      filename: 'js/vendor.bundle.js',
      path: path.resolve(__dirname, 'build'),
      library: 'vendor_lib',
    },
    plugins: [
      new webpack.DllPlugin({
        name: 'vendor_lib',
        path: 'build/vendor-manifest.json',
      }),
      new webpack.SourceMapDevToolPlugin({
        filename: 'js/vendor.bundle.js.map',
      }),
    ],
  }
}

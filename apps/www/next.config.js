const withPWA = require('next-pwa')
const withTM = require('next-transpile-modules')

const { NODE_ENV } = process.env

const isProduction = NODE_ENV === 'production'

module.exports = {
  ...withTM(['@tldraw/tldraw', '@tldraw/core'])(
    withPWA({
      reactStrictMode: true,
      pwa: {
        disable: !isProduction,
        dest: 'public',
      },
      productionBrowserSourceMaps: true,
    })
  ),
  assetPrefix: isProduction ? '/static/' : '',
}

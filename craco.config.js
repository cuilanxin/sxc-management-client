const path = require('path');
const lessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: lessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],

  // 🔥 正确的 babel 配置
  babel: {

  },

  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },

  devServer: {
    // port: 5173, 
    // proxy: {
    //   '/api': {
    //     target: 'https://xxx:8080',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': '',
    //     },
    //   },
    // },
  },
};
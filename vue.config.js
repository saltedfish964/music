module.exports = {
  devServer: {
    proxy: {
      '/': {
        target: 'https://netease.bluej.cn',
        changeOrigin: true,
      },
    },
  },
};

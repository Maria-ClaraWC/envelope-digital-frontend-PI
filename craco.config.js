// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Adicionar fallbacks para módulos Node.js
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        fallback: {
          ...webpackConfig.resolve.fallback,
          "path": false,
          "stream": false,
          "util": false,
          "url": false,
          "fs": false
        }
      };
      return webpackConfig;
    }
  }
};
const path = require('path');

// We don't use webpack.
// This is only for path resolution in WebStorm.
module.exports = {
  resolve: {
    alias: {
      root: path.resolve(__dirname, '.'),
      config: path.resolve(__dirname, 'config'),
      common: path.resolve(__dirname, 'lib/common'),
      domain: path.resolve(__dirname, 'lib/domain'),
      interfaces: path.resolve(__dirname, 'lib/interfaces'),
      infrastructure: path.resolve(__dirname, 'lib/infrastructure'),
    },
  },
};

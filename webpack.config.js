const path = require('path');

module.exports = {
  entry: './index.js',
  resolve: {
    alias: {
      common: path.resolve(__dirname, 'lib/common'),
      domain: path.resolve(__dirname, 'lib/domain'),
      interfaces: path.resolve(__dirname, 'lib/interfaces'),
      infrastructure: path.resolve(__dirname, 'lib/infrastructure'),
    },
  },
};

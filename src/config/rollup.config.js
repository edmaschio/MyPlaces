var replace = require('rollup-plugin-replace');
var isProd = (process.env.IONIC_ENV === 'prod');

plugins: [
    replace({
      exclude: 'node_modules/**',

      '/config/environment.dev' : ( isProd ? '/config/environment.prod' : '/config/environment.dev'),
    })
]
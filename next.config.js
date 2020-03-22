require('dotenv').config();
const path = require('path');

const withCss = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');

module.exports = withSass(
  withCss({
    env: {
      API_DIR: path.join(__dirname, 'api'),
    },
    webpack: config => {
      config.module.rules.push({
        test: /\.graphql?$/,
        use: [
          {
            loader: 'webpack-graphql-loader',
          },
        ],
      });

      return config;
    },
  }),
);

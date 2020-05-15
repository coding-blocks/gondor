require('dotenv').config();
const path = require('path');

const withCss = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withFonts = require('next-fonts');

module.exports = withSass(
  withCss(
    withFonts({
      env: {
        API_DIR: path.join(__dirname, 'api'),
        APP_URL: process.env.APP_URL,
        SENTRY_DSN_SERVER: process.env.SENTRY_DSN_SERVER,
        SENTRY_DSN_CLIENT: process.env.SENTRY_DSN_CLIENT,
      },
      exportTrailingSlash: true,
      enableSvg: true,
      webpack: (config, options) => {
        if (!options.isServer) {
          config.resolve.alias['@sentry/node'] = '@sentry/browser';
        }

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
  ),
);

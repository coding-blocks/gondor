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
      },
      exportTrailingSlash: true,
      enableSvg: true,
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
  ),
);

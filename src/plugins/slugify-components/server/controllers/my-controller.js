'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('slugify-components')
      .service('myService')
      .getWelcomeMessage();
  },
});

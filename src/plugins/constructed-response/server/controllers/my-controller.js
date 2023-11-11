'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('constructed-response')
      .service('myService')
      .getWelcomeMessage();
  },
});

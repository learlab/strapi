'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('question')
      .service('myService')
      .getWelcomeMessage();
  },
});

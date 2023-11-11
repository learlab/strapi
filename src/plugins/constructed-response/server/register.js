'use strict';

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: 'constructed-response',
    plugin: 'constructed-response',
    type: 'string',
  });
};

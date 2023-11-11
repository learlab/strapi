'use strict';

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: 'question',
    plugin: 'question',
    type: 'string',
  });
};

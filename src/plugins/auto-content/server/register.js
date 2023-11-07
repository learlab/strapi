'use strict';

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: 'question',
    plugin: 'auto-content',
    type: 'text',
    inputSize: {
      default: 12,
      isResizable: true,
    },
  });
};
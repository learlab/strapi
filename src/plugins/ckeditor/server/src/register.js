'use strict';

const pluginId = require('./utils/pluginId');

const register = ( { strapi } ) => {
  strapi.customFields.register( {
    name: 'CKEditor',
    plugin: 'ckeditor',
    type: 'richtext'
  } )
};

module.exports = register;

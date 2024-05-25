'use strict';

/**
 * api-key router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::api-key.api-key');

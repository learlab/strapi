'use strict';

/**
 * chunk service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::chunk.chunk');

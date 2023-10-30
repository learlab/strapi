'use strict';

/**
 * poe-page service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::poe-page.poe-page');

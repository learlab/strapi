"use strict";

/**
 * external-dashboard-uri router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter(
  "api::external-dashboard-uri.external-dashboard-uri",
);

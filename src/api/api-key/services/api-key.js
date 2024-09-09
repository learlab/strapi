"use strict";

const { deleteAPIKey } = require("../content-types/api-key/api-key-crud");

/**
 * api-key service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::api-key.api-key", ({ strapi }) => ({
  async generateAPIKey(ctx) {
    const targetURL = `${process.env.ITELL_API_URL}/generate/api_key`;

    try {
      const response = await fetch(targetURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": process.env.ITELL_API_KEY,
        },
        body: JSON.stringify(ctx),
      });
      const result = await response;
      return await result.text();
    } catch (error) {
      console.log(error);
    }
  },

  async deleteAPIKey(ctx) {
    const targetURL = `${process.env.ITELL_API_URL}/delete/api_key`;
    console.log(ctx);

    try {
      const response = await fetch(targetURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": process.env.ITELL_API_KEY,
        },
        body: JSON.stringify(ctx),
      });
      const result = await response;
      return result.text();
    } catch (error) {
      console.log(error);
    }
  },
}));

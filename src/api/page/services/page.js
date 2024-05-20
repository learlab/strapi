"use strict";

/**
 * page service
 */

const { createCoreService } = require("@strapi/strapi").factories;
const fetch = require("node-fetch");

module.exports = createCoreService("api::page.page", ({ strapi }) => ({
  async generateEmbedding(ctx) {
    // for testing
    // const targetURL = `https://httpbin.org/post `
    const targetURL = `${process.env.ITELL_API_URL}/generate/embedding`;

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
      return result;
    } catch (error) {
      console.log(error);
    }
  },

  async deleteEmbeddings(ctx) {
    // for testing
    const targetURL = `${process.env.ITELL_API_URL}/delete/embedding`;

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
      return result;
    } catch (error) {
      console.log(error);
    }
  },
}));

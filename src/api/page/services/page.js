'use strict';

/**
 * page service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const fetch = require("node-fetch");

module.exports = createCoreService('api::page.page', ({ strapi }) =>  ({
    async generateEmbedding(ctx) {
        // for testing 
        // const targetURL = `https://httpbin.org/post `
        const targetURL = `https://itell-api.learlab.vanderbilt.edu/generate/embedding`

        try {
          const response = await fetch(
            targetURL,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(ctx),
            }
          );
          const result = await response;
          return result;
        } catch (error) {
          console.log(error);
        }
      }

      async deleteEmbeddings(ctx) {
        // for testing 
        // const targetURL = `https://httpbin.org/delete`
        const targetURL = `https://itell-api.learlab.vanderbilt.edu/delete/unused`

        try {
          const response = await fetch(
            targetURL,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(ctx),
            }
          );
          const result = await response;
          return result;
        } catch (error) {
          console.log(error);
        }
      }
}));

"use strict";

async function createAPIKey(ctx) {

  const payload = {
    nickname: ctx.Nickname,
    role: ctx.Role,
  };

  console.log(payload);

  const api_key = await strapi
    .service("api::api-key.api-key")
    .generateAPIKey(payload);
  
  console.log(api_key, ctx.id);

  const res = await strapi.entityService.update("api::api-key.api-key", ctx.id, {
    data: {
      ApiKey: api_key,
    },
  });

  return res;
}

async function deleteAPIKey(id) {
  const entry = await strapi.entityService.findOne("api::api-key.api-key", id, {
    populate: "*",
  });

  const payload = {
    api_key: entry.api_key,
  };

  await strapi.service("api::api-key.api-key").deleteAPIKey(payload);
}

module.exports = {
  createAPIKey,
  deleteAPIKey,
};

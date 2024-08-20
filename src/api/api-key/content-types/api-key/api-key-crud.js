"use strict";

async function createAPIKey(ctx) {
  const entry = await strapi.entityService.findOne(
    "api::api-key.api-key",
    ctx.id,
    {
      populate: "*",
    },
  );

  const payload = {
    nickname: entry.nickname,
    role: entry.role,
  };

  const api_key = await strapi
    .service("api::api-key.api-key")
    .generateAPIKey(payload);

  await strapi.entityService.update("api::api-key.api-key", entry.id, {
    data: {
      api_key: api_key,
    },
  });
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

"use strict";
const {
  generateSlugAfterCreate,
  generateSlugBeforeUpdate,
  generateChunkFields,
  generateVideoFields,
} = require("./updateFields");
const { shouldUpdate } = require("./shouldUpdate");
const { validateKeyPhraseField } = require("./validations");

const chunkLifecycle = {
  beforeCreate: async (event) => {
    validateKeyPhraseField(event);
    event = await generateChunkFields(event);
  },
  afterCreate: async (event) => {
    await generateSlugAfterCreate(event);
  },
  beforeUpdate: async (event) => {
    validateKeyPhraseField(event);
    if (shouldUpdate(event)) {
      event = await generateChunkFields(event);
      event = await generateSlugBeforeUpdate(event);
    }
  },
};

const videoLifecycle = {
  beforeCreate: async (event) => {
    validateKeyPhraseField(event);
    event = await generateVideoFields(event);
  },
  afterCreate: async (event) => {
    await generateSlugAfterCreate(event);
  },
  beforeUpdate: async (event) => {
    validateKeyPhraseField(event);
    if (shouldUpdate(event)) {
      event = await generateVideoFields(event);
      event = await generateSlugBeforeUpdate(event);
    }
  },
};

module.exports = ({ strapi }) => {
  const _strapi = strapi;
  const _metadata = _strapi.db.metadata;

  _metadata.set("page.chunk", {
    ..._metadata.get("page.chunk"),
    lifecycles: chunkLifecycle,
  });

  _metadata.set("page.plain-chunk", {
    ..._metadata.get("page.plain-chunk"),
    lifecycles: chunkLifecycle,
  });

  _metadata.set("page.video", {
    ..._metadata.get("page.video"),
    lifecycles: videoLifecycle,
  });
};

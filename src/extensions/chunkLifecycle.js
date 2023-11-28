'use strict';
const { shouldUpdate } = require('./shouldUpdate');
const {
    generateSlugAfterCreate,
    generateSlugBeforeUpdate,
    generateChunkFields
} = require('./updateFields');

module.exports = ({ strapi }) => {
    const _strapi = strapi;
    const _metadata = _strapi.db.metadata;

    _metadata.set("page.chunk", {
        ..._metadata.get("page.chunk"),
        lifecycles: {
            beforeCreate: async (event) => {
                event = await generateChunkFields(event);
            },
            afterCreate: async (event) => {
                await generateSlugAfterCreate(event);
            },
            beforeUpdate: async (event) => {
                if (shouldUpdate(event)) {
                    event = await generateChunkFields(event);
                    event = await generateSlugBeforeUpdate(event);
                }
            },
        },
    });
}
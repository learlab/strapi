'use strict';
const { shouldUpdate } = require('./shouldUpdate');
const {
    generateSlugAfterCreate,
    generateSlugBeforeUpdate,
    generateVideoFields
} = require('./updateFields');

module.exports = ({ strapi }) => {
    const _strapi = strapi;
    const _metadata = _strapi.db.metadata;
    _metadata.set("page.video", {
        ..._metadata.get("page.video"),
        lifecycles: {
            beforeCreate: async (event) => {
                event = await generateVideoFields(event);
            },
            afterCreate: async (event) => {
                await generateSlugAfterCreate(event);
            },
            beforeUpdate: async (event) => {
                if (shouldUpdate(event)) {
                    event = await generateVideoFields(event);
                    event = await generateSlugBeforeUpdate(event);
                }
            },
        },
    });
}
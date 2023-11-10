'use strict';
var _ = require("lodash");

module.exports = ({ strapi }) => {
    const _strapi = strapi;
    const _metadata = _strapi.db.metadata;
    _metadata.set("page.chunk", {
        ..._metadata.get("page.chunk"),
        lifecycles: {
            beforeCreate: async (event) => {
                const { data } = event.params;

                const cleanText = await strapi
                    .service('plugin::auto-content.cleanTextService')
                    .cleanText(data.Text)

                const mdx = await strapi
                    .service('plugin::auto-content.mdxService')
                    .mdx(data.Text)

                event.params.data.MDX = mdx;
                event.params.data.CleanText = cleanText;
            },

            beforeUpdate: async (event) => {
                // incoming data update
                const { data, where } = event.params;

                // omit fields that are not included in oldData
                var newData = _.omit(data, ["__component", "__temp_key__", "updatedAt"]);
                // console.log(newData);

                // get the old data from the database
                const oldData = await strapi
                    .query("page.chunk")
                    .findOne({ where: { id: where.id } });

                // console.log(oldData);

                if (!_.isEqual(newData, oldData)) {
                    const cleanText = await strapi
                        .service('plugin::auto-content.cleanTextService')
                        .cleanText(newData.Text)

                    const mdx = await strapi
                        .service('plugin::auto-content.mdxService')
                        .mdx(newData.Text)

                    event.params.data.MDX = mdx;
                    event.params.data.CleanText = cleanText;
                }
            },
        },
    });
}
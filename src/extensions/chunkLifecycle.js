'use strict';
var _ = require("lodash");
var slugify = require('slugify');
var prefix = "textchunk-";

// In case we go back to incremental route
// function checkDuplicate (allSlugs, targetSlug) {
//     const found = allSlugs.some(item => item.Slug === targetSlug);
//     if (found) {
//         const parts = targetSlug.split('-');

//         const incrementedNumber = parseInt(parts[parts.length - 1]) + 1;

//         const newSlug = parts.slice(0, -1).join('-') + '-' + incrementedNumber;

//         return checkDuplicate(allSlugs, newSlug);
//     } else {
//         return targetSlug;
//     };
// };

function slugPipeline(chunkName, targetId) {
    if (chunkName) {
        return prefix + slugify(chunkName) + "-" + targetId;
    } else {
        return "";
    }
};

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
                console.log(event.params);

                // omit fields that are not included in oldData
                var newData = _.omit(data, ["__component", "__temp_key__", "updatedAt"]);
                // console.log(newData);

                // get the old data from the database
                const oldData = await strapi
                    .query("page.chunk")
                    .findOne({ where: { id: where.id } });

                // const slug = "chunk-" + slugify(data.Header) + "-" + where.id.toString();
                // event.params.data.Slug = slug;

                if (!_.isEqual(newData, oldData)) {
                    const cleanText = await strapi
                        .service('plugin::auto-content.cleanTextService')
                        .cleanText(newData.Text)

                    const mdx = await strapi
                        .service('plugin::auto-content.mdxService')
                        .mdx(newData.Text)

                    const slug = slugPipeline(data.Header, where.id.toString());

                    event.params.data.MDX = mdx;
                    event.params.data.CleanText = cleanText;
                    event.params.data.Slug = slug;                    
                }
            },

            // ID info only available after creation
            afterCreate: async (event) => {
                const { result  } = event;
                const targetId = result.id;
                const slug = slugPipeline(result.Header, targetId.toString());

                result.Slug = slug;

                const update = await strapi
                    .query("page.chunk")
                    .update({ where: { id: targetId } ,
                              data: result });
            },

        },
    });
}
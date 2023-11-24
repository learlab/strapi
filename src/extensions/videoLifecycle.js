'use strict';
var _ = require("lodash");
var slugify = require('slugify');
var suffix = "v";

function slugPipeline(chunkName, targetId) {
    if (chunkName) {
        return slugify(chunkName) + "-" + targetId + suffix;
    } else {
        return "";
    }
};

module.exports = ({ strapi }) => {
    const _strapi = strapi;
    const _metadata = _strapi.db.metadata;
    _metadata.set("page.video", {
        ..._metadata.get("page.video"),
        lifecycles: {
            beforeCreate: async (event) => {
                // incoming data update
                const { data } = event.params;

                // fetch transcript
                const transcript = await strapi
                    .service('plugin::auto-content.fetchTranscriptService')
                    .getTranscript(data.URL, data.StartTime, data.EndTime)

                // construct MDX
                var mdx = '<YoutubeVideo\n' +
                    `src=${data.URL}\n`

                if (data.Title) mdx += `title="${data.Title}"`

                if (data.Description) mdx += `\n>\n${data.Description}`
                else mdx += '>'

                mdx += '\n</YoutubeVideo>'

                event.params.data.CleanText = transcript;
                event.params.data.MDX = mdx;
            },

            beforeUpdate: async (event) => {
                // incoming data update
                const { data, where } = event.params;

                // omit fields that are not included in oldData
                var newData = _.omit(data, ["__component", "__temp_key__", "updatedAt"]);

                // get the old data from the database
                const oldData = await strapi
                    .query("page.video")
                    .findOne({ where: { id: where.id } });

                // check if the dictionary-like JavaScript Objects are equal.
                if (!_.isEqual(newData, oldData)) {
                    // duplicate of beforeCreate steps
                    const transcript = await strapi
                        .service('plugin::auto-content.fetchTranscriptService')
                        .getTranscript(newData.URL, newData.StartTime, newData.EndTime)

                    var mdx = '<YoutubeVideo\n' +
                        `src=${newData.URL}\n`

                    if (newData.Title) mdx += `title="${newData.Title}"`

                    if (newData.Description) mdx += `\n>\n${newData.Description}`
                    else mdx += '>'

                    mdx += '\n</YoutubeVideo>'

                    const slug = slugPipeline(data.Title, where.id.toString()); 

                    event.params.data.CleanText = transcript;
                    event.params.data.MDX = mdx;
                    event.params.data.Slug = slug;
                }
            },

            // ID info only available after creation
            afterCreate: async (event) => {
                const { result  } = event;
                const targetId = result.id;
                const slug = slugPipeline(result.Title, targetId.toString());

                result.Slug = slug;

                const update = await strapi
                    .query("page.video")
                    .update({ where: { id: targetId } ,
                              data: result });
            },
        },
    });
}
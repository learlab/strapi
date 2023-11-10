'use strict';
var _ = require("lodash");

module.exports = ({ strapi }) => {
    const _strapi = strapi;
    const _metadata = _strapi.db.metadata;
    _metadata.set("page.video", {
        ..._metadata.get("page.video"),
        lifecycles: {
            beforeUpdate: async (event) => {
                // incoming data update
                const { data, where } = event.params;

                // omit fields that are not included in oldData
                var newData = _.omit(data, ["__component", "__temp_key__", "updatedAt"]);
                // console.log(newData);

                // get the old data from the database
                const oldData = await strapi
                    .query("page.video")
                    .findOne({ where: { id: where.id } });

                // console.log(oldData);

                if (!_.isEqual(newData, oldData)) {
                    const transcript = await strapi
                        .service('plugin::auto-content.fetchTranscriptService')
                        .getTranscript(newData.URL, newData.StartTime, newData.EndTime)

                    var mdx = '<YoutubeVideo\n' +
                    `src=${newData.URL}\n`
                
                    if (newData.Title) mdx += `title="${newData.Title}"`
                
                    if (newData.Description) mdx += `\n>\n${newData.Description}`                
                    else mdx += '>'

                    mdx += '\n</YoutubeVideo>'

                    event.params.data.CleanText = transcript;
                    event.params.data.MDX = mdx;
                }
            },
        },
    });
}
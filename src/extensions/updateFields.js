
'use strict';
var slugify = require('slugify');

async function slugPipeline(chunkName, databaseID, chunkTypeSuffix) {
    if (chunkName) {
        const slug = slugify(chunkName);
        return `${slug}-${databaseID.toString()}${chunkTypeSuffix}`;
    } else {
        return "";
    }
};

async function generateSlugAfterCreate(event) {
    const { result, model } = event;

    const databaseID = result.id;
    var chunkName = null;
    var chunkTypeSuffix = null;

    if (model.singularName === 'chunk') {
        chunkName = result.Header
        chunkTypeSuffix = 't'
    } else if (model.singularName === 'video') {
        chunkName = result.Title
        chunkTypeSuffix = 'v'
    }

    result.Slug = await slugPipeline(chunkName, databaseID, chunkTypeSuffix);

    const update = await strapi
        .query(String(model.uid))
        .update({
            where: { id: databaseID },
            data: result
        });
    }

async function generateSlugBeforeUpdate(event) {
    const { model } = event;
    const { data } = event.params;

    const databaseID = data.id;
    var chunkName = null;
    var chunkTypeSuffix = null;

    if (model.singularName === 'chunk') {
        chunkName = data.Header
        chunkTypeSuffix = 't'
    } else if (model.singularName === 'video') {
        chunkName = data.Title
        chunkTypeSuffix = 'v'
    }

    const slug = await slugPipeline(chunkName, databaseID, chunkTypeSuffix);
    event.params.data.Slug = slug;

    return event;
}


async function generateChunkFields(event) {
    const { data } = event.params;
    const cleanText = await strapi
        .service('plugin::auto-content.cleanTextService')
        .cleanText(data.Text)

    const mdx = await strapi
        .service('plugin::auto-content.mdxService')
        .mdx(data.Text)

        event.params.data.CleanText = cleanText;
        event.params.data.MDX = mdx;
    
    return event;
}

async function generateVideoFields(event) {
    const { data } = event.params;

    const transcript = await strapi
        .service('plugin::auto-content.fetchTranscriptService')
        .getTranscript(data.URL, data.StartTime, data.EndTime)
    
    var mdx = '<YoutubeVideo\n' +
        `src=${data.URL}\n`

    if (data.Title) mdx += `title="${data.Title}"`

    if (data.Description) mdx += `\n>\n${data.Description}`
    else mdx += '>'

    mdx += '\n</YoutubeVideo>'

    event.params.data.CleanText = transcript;
    event.params.data.MDX = mdx;

    return event;
}

module.exports = {
    generateSlugAfterCreate,
    generateSlugBeforeUpdate,
    generateChunkFields,
    generateVideoFields
};